"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Copy, Eye, EyeOff, Globe, Send, Shield } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  getCookieValue,
  isJsonObject,
  ORG_SELECTION_COOKIE,
} from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InAppEnvironment = "production" | "staging" | "development";
type SecretKeyEnvironment = "live" | "test";

type InAppOrigin = {
  id: string;
  origin: string;
  environment: InAppEnvironment;
};

type SecretKeyMeta = {
  id: string;
  environment: SecretKeyEnvironment;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
};

type InAppStatus = {
  publishableKeys: { production?: string; test?: string };
  secretKeys: SecretKeyMeta[];
  sessionCount: number | null;
  usage: Record<string, unknown> | null;
};

const readString = (obj: Record<string, unknown> | null, key: string) => {
  if (!obj) return "";
  const v = obj[key];
  return typeof v === "string" ? v.trim() : "";
};

const readNumber = (obj: Record<string, unknown> | null, key: string) => {
  if (!obj) return null;
  const v = obj[key];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
};

const normalizeStatus = (input: unknown): InAppStatus => {
  if (!isJsonObject(input)) {
    return {
      publishableKeys: {},
      secretKeys: [],
      sessionCount: null,
      usage: null,
    };
  }
  const obj = input as Record<string, unknown>;
  const data = isJsonObject(obj.data)
    ? (obj.data as Record<string, unknown>)
    : obj;

  const keys = isJsonObject(data.keys)
    ? (data.keys as Record<string, unknown>)
    : isJsonObject(data.apiKeys)
      ? (data.apiKeys as Record<string, unknown>)
      : isJsonObject(data.inapp)
        ? (data.inapp as Record<string, unknown>)
        : null;

  const publishableNested = isJsonObject(data.publishable)
    ? (data.publishable as Record<string, unknown>)
    : isJsonObject(data.publishableKey)
      ? (data.publishableKey as Record<string, unknown>)
      : null;
  const inappObj = isJsonObject(data.inapp)
    ? (data.inapp as Record<string, unknown>)
    : null;
  const inappKeysObj = isJsonObject(inappObj?.keys)
    ? (inappObj?.keys as Record<string, unknown>)
    : null;

  const publishableKeysObj =
    (isJsonObject(data.publishableKeys)
      ? (data.publishableKeys as Record<string, unknown>)
      : isJsonObject(keys?.publishableKeys)
        ? (keys?.publishableKeys as Record<string, unknown>)
        : isJsonObject(inappObj?.keys)
          ? (inappObj?.keys as Record<string, unknown>)
          : null) ??
    (isJsonObject(keys?.inapp)
      ? ((keys?.inapp as Record<string, unknown>).keys as Record<
          string,
          unknown
        >)
      : null);

  const production =
    readString(publishableKeysObj, "production") ||
    readString(inappKeysObj, "production") ||
    readString(publishableNested, "production") ||
    readString(publishableNested, "live") ||
    readString(publishableNested, "key") ||
    readString(publishableNested, "value") ||
    readString(data, "publishableKey") ||
    readString(data, "pk");

  const test =
    readString(publishableKeysObj, "test") ||
    readString(inappKeysObj, "test") ||
    readString(publishableNested, "test");

  let secretKeysRaw: unknown[] = [];
  if (
    isJsonObject(data.apiKeys) &&
    Array.isArray((data.apiKeys as Record<string, unknown>).secretKeys)
  ) {
    secretKeysRaw = (data.apiKeys as Record<string, unknown>)
      .secretKeys as unknown[];
  } else if (isJsonObject(keys) && Array.isArray(keys.secretKeys)) {
    secretKeysRaw = keys.secretKeys as unknown[];
  } else if (
    isJsonObject(data.apiKeys) &&
    isJsonObject((data.apiKeys as Record<string, unknown>).secretKeys) &&
    Array.isArray(
      (
        (data.apiKeys as Record<string, unknown>).secretKeys as Record<
          string,
          unknown
        >
      ).items
    )
  ) {
    secretKeysRaw = (
      (data.apiKeys as Record<string, unknown>).secretKeys as Record<
        string,
        unknown
      >
    ).items as unknown[];
  } else if (Array.isArray((data as Record<string, unknown>).secretKeys)) {
    secretKeysRaw = (data as Record<string, unknown>).secretKeys as unknown[];
  }

  const secretKeys: SecretKeyMeta[] = Array.isArray(secretKeysRaw)
    ? secretKeysRaw
        .map((row): SecretKeyMeta | null => {
          if (!isJsonObject(row)) return null;
          const r = row as Record<string, unknown>;
          const idRaw = r.id ?? r.keyId ?? r.secretKeyId ?? r._id ?? "";
          const id = typeof idRaw === "string" ? idRaw.trim() : String(idRaw);
          if (!id) return null;
          const envRaw = readString(r, "environment").toLowerCase();
          const environment: SecretKeyEnvironment =
            envRaw === "live" || envRaw === "test" ? envRaw : "live";
          const createdAt =
            readString(r, "createdAt") || readString(r, "created_at");
          const updatedAt =
            readString(r, "updatedAt") || readString(r, "updated_at");
          const name = readString(r, "name");
          return {
            id,
            environment,
            createdAt,
            updatedAt,
            name: name || undefined,
          };
        })
        .filter((v): v is SecretKeyMeta => Boolean(v))
    : [];

  const sessionCount =
    readNumber(data, "sessionCount") ??
    readNumber(data, "sessions") ??
    readNumber(data, "activeSessions");

  const usage = isJsonObject(data.usage)
    ? (data.usage as Record<string, unknown>)
    : null;

  const publishableKeys: { production?: string; test?: string } = {};
  if (production) publishableKeys.production = production;
  if (test) publishableKeys.test = test;

  return { publishableKeys, secretKeys, sessionCount, usage };
};

const normalizeOrigins = (input: unknown): InAppOrigin[] => {
  const list = Array.isArray(input)
    ? input
    : isJsonObject(input) &&
        Array.isArray((input as Record<string, unknown>).data)
      ? ((input as Record<string, unknown>).data as unknown[])
      : isJsonObject(input) &&
          isJsonObject((input as Record<string, unknown>).data) &&
          Array.isArray(
            ((input as Record<string, unknown>).data as Record<string, unknown>)
              .data
          )
        ? (((input as Record<string, unknown>).data as Record<string, unknown>)
            .data as unknown[])
        : [];

  return list
    .map((row): InAppOrigin | null => {
      if (!isJsonObject(row)) return null;
      const o = row as Record<string, unknown>;
      const idRaw = o.id ?? o.originId ?? o._id ?? "";
      const origin = readString(o, "origin");
      const environmentRaw = readString(o, "environment") as InAppEnvironment;
      const id = typeof idRaw === "string" ? idRaw.trim() : String(idRaw);
      if (!id || !origin) return null;
      const environment: InAppEnvironment =
        environmentRaw === "production" ||
        environmentRaw === "staging" ||
        environmentRaw === "development"
          ? environmentRaw
          : "production";
      return { id, origin, environment };
    })
    .filter((v): v is InAppOrigin => Boolean(v));
};

const maskKey = (key: string) => {
  if (!key) return "";
  if (key.length <= 10) return `${key.slice(0, 2)}••••••`;
  return `${key.slice(0, 8)}••••••••••••••••`;
};

const safeOrgId = (session: unknown): string | null => {
  if (isJsonObject(session)) {
    const s = session as Record<string, unknown>;
    const nested = isJsonObject(s.session)
      ? (s.session as Record<string, unknown>)
      : null;
    const raw =
      nested?.activeOrganizationId ??
      nested?.organizationId ??
      s.activeOrganizationId ??
      s.organizationId;
    if (typeof raw === "string" && raw.trim().length > 0) return raw.trim();
  }

  const cookieOrgId = getCookieValue(ORG_SELECTION_COOKIE);
  return cookieOrgId && cookieOrgId.trim().length > 0
    ? cookieOrgId.trim()
    : null;
};

const jsonRequest = async ({
  url,
  method,
  orgId,
  body,
}: {
  url: string;
  method: "GET" | "POST" | "DELETE";
  orgId: string;
  body?: unknown;
}) => {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-org-id": orgId,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data: unknown = await res.json().catch(async () => {
    try {
      const text = await res.text();
      return text ? { message: text } : null;
    } catch {
      return null;
    }
  });
  if (!res.ok) {
    const message =
      isJsonObject(data) && typeof data.message === "string"
        ? data.message
        : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
};

const InAppIntegration = () => {
  const { data: session } = authClient.useSession();
  const orgId = safeOrgId(session);

  const queryClient = useQueryClient();
  const [showPublishable, setShowPublishable] = useState(false);
  const [copiedKey, setCopiedKey] = useState<"pk" | "sk" | null>(null);

  const [originInput, setOriginInput] = useState("");
  const [originEnv, setOriginEnv] = useState<InAppEnvironment>("production");

  const [testWalletAddress, setTestWalletAddress] = useState("");
  const [testTitle, setTestTitle] = useState("");
  const [testBody, setTestBody] = useState("");
  const [testCtaLabel, setTestCtaLabel] = useState("");
  const [testCtaUrl, setTestCtaUrl] = useState("");

  const [createSecretOpen, setCreateSecretOpen] = useState(false);
  const [secretEnv, setSecretEnv] = useState<SecretKeyEnvironment>("live");
  const [secretName, setSecretName] = useState("");
  const [createdSecretToken, setCreatedSecretToken] = useState("");

  const statusQuery = useQuery({
    queryKey: ["integrations", "inapp", "status", orgId],
    enabled: Boolean(orgId),
    queryFn: async () => {
      if (!orgId) return null;
      return jsonRequest({
        url: "/api/v1/integrations/inapp/status",
        method: "GET",
        orgId,
      });
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const originsQuery = useQuery({
    queryKey: ["integrations", "inapp", "origins", orgId],
    enabled: Boolean(orgId),
    queryFn: async () => {
      if (!orgId) return [];
      return jsonRequest({
        url: "/api/v1/integrations/inapp/origins",
        method: "GET",
        orgId,
      });
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const status = useMemo(
    () => normalizeStatus(statusQuery.data),
    [statusQuery.data]
  );

  const hasRetriedStatusRef = useRef(false);
  useEffect(() => {
    if (!orgId) return;
    if (statusQuery.isLoading || statusQuery.isError) return;
    if (!statusQuery.isSuccess) return;
    if (hasRetriedStatusRef.current) return;
    if (status.publishableKeys.production || status.publishableKeys.test)
      return;
    hasRetriedStatusRef.current = true;
    void statusQuery.refetch();
  }, [
    orgId,
    status.publishableKeys.production,
    status.publishableKeys.test,
    statusQuery,
  ]);
  const origins = useMemo(
    () => normalizeOrigins(originsQuery.data),
    [originsQuery.data]
  );

  const addOriginMutation = useMutation({
    mutationFn: async () => {
      if (!orgId) throw new Error("No active organization");
      const raw = originInput.trim();
      if (!raw) throw new Error("Origin is required");
      const origin =
        raw.startsWith("http://") || raw.startsWith("https://")
          ? raw
          : `https://${raw}`;
      const parsedOrigin = new URL(origin).origin;
      return jsonRequest({
        url: "/api/v1/integrations/inapp/origins",
        method: "POST",
        orgId,
        body: { origin: parsedOrigin, environment: originEnv },
      });
    },
    onSuccess: async () => {
      toast.success("Origin added");
      setOriginInput("");
      await queryClient.invalidateQueries({
        queryKey: ["integrations", "inapp", "origins", orgId],
      });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to add origin");
    },
  });

  const removeOriginMutation = useMutation({
    mutationFn: async (originId: string) => {
      if (!orgId) throw new Error("No active organization");
      return jsonRequest({
        url: `/api/v1/integrations/inapp/origins/${encodeURIComponent(originId)}`,
        method: "DELETE",
        orgId,
      });
    },
    onSuccess: async () => {
      toast.success("Origin removed");
      await queryClient.invalidateQueries({
        queryKey: ["integrations", "inapp", "origins", orgId],
      });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove origin"
      );
    },
  });

  const testPushMutation = useMutation({
    mutationFn: async () => {
      if (!orgId) throw new Error("No active organization");
      const walletAddress = testWalletAddress.trim();
      if (!walletAddress) throw new Error("Wallet address is required");
      const title = testTitle.trim();
      const body = testBody.trim();
      if (!title || !body) throw new Error("Title and body are required");
      const payload: Record<string, unknown> = { walletAddress, title, body };
      if (testCtaLabel.trim()) payload.ctaLabel = testCtaLabel.trim();
      if (testCtaUrl.trim()) payload.ctaUrl = testCtaUrl.trim();
      return jsonRequest({
        url: "/api/v1/integrations/inapp/test-push",
        method: "POST",
        orgId,
        body: payload,
      });
    },
    onSuccess: () => {
      toast.success("Test push sent");
      setTestWalletAddress("");
      setTestTitle("");
      setTestBody("");
      setTestCtaLabel("");
      setTestCtaUrl("");
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to send test push"
      );
    },
  });

  const createSecretKeyMutation = useMutation({
    mutationFn: async () => {
      if (!orgId) throw new Error("No active organization");
      const payload: Record<string, unknown> = { environment: secretEnv };
      const trimmedName = secretName.trim();
      if (trimmedName) payload.name = trimmedName;
      return jsonRequest({
        url: "/api/v1/integrations/keys/secret",
        method: "POST",
        orgId,
        body: payload,
      });
    },
    onSuccess: async (data) => {
      const token =
        isJsonObject(data) &&
        typeof (data as Record<string, unknown>).token === "string"
          ? String((data as Record<string, unknown>).token)
          : isJsonObject(data) &&
              isJsonObject((data as Record<string, unknown>).data) &&
              typeof (
                (data as Record<string, unknown>).data as Record<
                  string,
                  unknown
                >
              ).token === "string"
            ? String(
                (
                  (data as Record<string, unknown>).data as Record<
                    string,
                    unknown
                  >
                ).token
              )
            : "";
      if (!token) {
        toast.error("Secret key created, but no token was returned");
        return;
      }
      setCreatedSecretToken(token);
      toast.success("Secret key created");
      await queryClient.invalidateQueries({
        queryKey: ["integrations", "inapp", "status", orgId],
      });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to create secret key"
      );
    },
  });

  const copyToClipboard = async (kind: "pk" | "sk", value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedKey(kind);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.1)",
      }}
      className="group rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 lg:p-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 lg:h-12 lg:w-12">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-medium text-foreground">In-app push</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Configure SDK keys, allowed origins, and test delivery.
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              {status.sessionCount !== null ? (
                <span>{status.sessionCount} active sessions</span>
              ) : (
                <span />
              )}
            </div>
          </div>

          {!orgId ? (
            <div className="mt-5 rounded-xl border border-border/80 bg-muted/50 p-4 text-sm text-muted-foreground">
              Select an organization to manage in-app integration.
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-border/80 bg-muted/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">
                      Publishable keys
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowPublishable((v) => !v)}
                        className="h-9 w-9 border-border/80"
                        aria-label="Toggle publishable key visibility"
                      >
                        {showPublishable ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs text-muted-foreground">
                        Production
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          void copyToClipboard(
                            "pk",
                            status.publishableKeys.production ?? ""
                          )
                        }
                        className="h-9 w-9 border-border/80 bg-transparent"
                        aria-label="Copy production publishable key"
                      >
                        {copiedKey === "pk" ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <code className="block w-full rounded-xl border border-border/80 bg-card px-3 py-2 font-mono text-xs text-foreground">
                      {statusQuery.isLoading
                        ? "Loading…"
                        : showPublishable
                          ? status.publishableKeys.production || "—"
                          : status.publishableKeys.production
                            ? maskKey(status.publishableKeys.production)
                            : "—"}
                    </code>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="text-xs text-muted-foreground">Test</div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          void copyToClipboard(
                            "pk",
                            status.publishableKeys.test ?? ""
                          )
                        }
                        className="h-9 w-9 border-border/80 bg-transparent"
                        aria-label="Copy test publishable key"
                      >
                        {copiedKey === "pk" ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <code className="block w-full rounded-xl border border-border/80 bg-card px-3 py-2 font-mono text-xs text-foreground">
                      {statusQuery.isLoading
                        ? "Loading…"
                        : showPublishable
                          ? status.publishableKeys.test || "—"
                          : status.publishableKeys.test
                            ? maskKey(status.publishableKeys.test)
                            : "—"}
                    </code>
                  </div>
                  {statusQuery.isError && (
                    <div className="mt-2 text-xs text-destructive">
                      Failed to load status
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-border/80 bg-muted/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">
                      Secret keys
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="h-9 border-border/80"
                        onClick={() => {
                          setCreatedSecretToken("");
                          setSecretName("");
                          setSecretEnv("live");
                          setCreateSecretOpen(true);
                        }}
                        type="button"
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {statusQuery.isLoading ? (
                      <div className="text-sm text-muted-foreground">
                        Loading…
                      </div>
                    ) : status.secretKeys.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No secret keys created yet
                      </div>
                    ) : (
                      status.secretKeys.slice(0, 3).map((k) => (
                        <div
                          key={k.id}
                          className="rounded-xl border border-border/80 bg-card px-3 py-2"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-xs font-medium text-foreground">
                                {k.name ? k.name : "Secret key"}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {k.environment}
                                {k.createdAt ? ` • ${k.createdAt}` : ""}
                              </div>
                            </div>
                            <code className="shrink-0 font-mono text-[11px] text-muted-foreground">
                              {k.id}
                            </code>
                          </div>
                        </div>
                      ))
                    )}
                    {status.secretKeys.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        {status.secretKeys.length - 3} more…
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      The `sk_*` token is shown only once at creation time.
                    </div>
                  </div>
                </div>
              </div>
              {statusQuery.isSuccess &&
                !statusQuery.isLoading &&
                !statusQuery.isError &&
                !status.publishableKeys.production &&
                !status.publishableKeys.test &&
                status.secretKeys.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    Keys are not available for this org yet. Confirm you are an
                    org admin and that `GET /integrations/inapp/status` returns
                    publishable keys. To mint a usable `sk_*`, create one via
                    `POST /integrations/keys/secret` and save the returned token
                    immediately.
                  </div>
                )}

              <div className="rounded-2xl border border-border/80 bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Globe className="h-4 w-4 text-primary" />
                  Allowed origins
                </div>

                <form
                  className="mt-4 grid gap-3 lg:grid-cols-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addOriginMutation.mutate();
                  }}
                >
                  <div className="lg:col-span-3">
                    <Label className="sr-only">Origin</Label>
                    <Input
                      value={originInput}
                      onChange={(e) => setOriginInput(e.target.value)}
                      placeholder="https://app.example.com"
                      className="h-11 border-border/80"
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <Label className="sr-only">Environment</Label>
                    <Select
                      value={originEnv}
                      onValueChange={(v) => setOriginEnv(v as InAppEnvironment)}
                    >
                      <SelectTrigger className="h-11 border-border/80">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="lg:col-span-1">
                    <Button
                      type="submit"
                      className="h-11 w-full"
                      disabled={addOriginMutation.isPending}
                    >
                      Add
                    </Button>
                  </div>
                </form>

                <div className="mt-4 space-y-2">
                  {originsQuery.isLoading ? (
                    <div className="text-sm text-muted-foreground">
                      Loading…
                    </div>
                  ) : origins.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No origins configured
                    </div>
                  ) : (
                    origins.map((o) => (
                      <div
                        key={o.id}
                        className="flex flex-col gap-2 rounded-xl border border-border/80 bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="truncate font-mono text-sm text-foreground">
                            {o.origin}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {o.environment}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="h-9 border-border/80"
                          disabled={removeOriginMutation.isPending}
                          onClick={() => removeOriginMutation.mutate(o.id)}
                          type="button"
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Send className="h-4 w-4 text-primary" />
                  Test push
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sends a single in-app message to a wallet for validation.
                </p>

                <form
                  className="mt-4 grid gap-4 lg:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    testPushMutation.mutate();
                  }}
                >
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Wallet address
                    </Label>
                    <Input
                      value={testWalletAddress}
                      onChange={(e) => setTestWalletAddress(e.target.value)}
                      placeholder="0x…"
                      className="h-11 border-border/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Title
                    </Label>
                    <Input
                      value={testTitle}
                      onChange={(e) => setTestTitle(e.target.value)}
                      placeholder="New notification"
                      className="h-11 border-border/80"
                    />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <Label className="text-sm font-medium text-foreground">
                      Body
                    </Label>
                    <Input
                      value={testBody}
                      onChange={(e) => setTestBody(e.target.value)}
                      placeholder="Hello from OnchainSuite"
                      className="h-11 border-border/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      CTA label (optional)
                    </Label>
                    <Input
                      value={testCtaLabel}
                      onChange={(e) => setTestCtaLabel(e.target.value)}
                      placeholder="View"
                      className="h-11 border-border/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      CTA URL (optional)
                    </Label>
                    <Input
                      value={testCtaUrl}
                      onChange={(e) => setTestCtaUrl(e.target.value)}
                      placeholder="https://…"
                      className="h-11 border-border/80"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Button
                      type="submit"
                      className="h-11 w-full"
                      disabled={testPushMutation.isPending}
                    >
                      Send test push
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Dialog open={createSecretOpen} onOpenChange={setCreateSecretOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-tight text-foreground">
              Create secret key
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This will return an `sk_*` token once. Store it immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-foreground">
                Environment
              </Label>
              <Select
                value={secretEnv}
                onValueChange={(v) => setSecretEnv(v as SecretKeyEnvironment)}
              >
                <SelectTrigger className="h-11 border-border/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-foreground">
                Name (optional)
              </Label>
              <Input
                value={secretName}
                onChange={(e) => setSecretName(e.target.value)}
                placeholder="Server integration"
                className="h-11 border-border/80"
              />
            </div>

            {createdSecretToken && (
              <div className="rounded-xl border border-border/80 bg-muted/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-foreground">
                    New secret token
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      void copyToClipboard("sk", createdSecretToken)
                    }
                    className="h-9 w-9 border-border/80 bg-transparent"
                    aria-label="Copy new secret token"
                  >
                    {copiedKey === "sk" ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <code className="mt-2 block w-full break-all rounded-xl border border-border/80 bg-card px-3 py-2 font-mono text-xs text-foreground">
                  {createdSecretToken}
                </code>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCreateSecretOpen(false)}
              type="button"
            >
              Close
            </Button>
            <Button
              onClick={() => createSecretKeyMutation.mutate()}
              disabled={createSecretKeyMutation.isPending}
              type="button"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default InAppIntegration;
