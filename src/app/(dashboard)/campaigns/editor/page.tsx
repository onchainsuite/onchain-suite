"use client";

import { useQuery } from "@tanstack/react-query";
import { Maximize2, Minimize2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { cn, getSelectedOrganizationId, isJsonObject } from "@/lib/utils";

import { campaignsService } from "@/features/campaigns/campaigns.service";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.CAMPAIGNS, label: "Campaigns" },
];

const DEFAULT_EDITOR_ORIGIN_PROD = "https://editor.onchainsuite.com";
const DEFAULT_EDITOR_ORIGIN_DEV = DEFAULT_EDITOR_ORIGIN_PROD;
const DEFAULT_BACKEND_API_BASE_PROD =
  "https://onchain-backend-dvxw.onrender.com/api/v1";

const isPlaceholderEditorHost = (hostname: string) =>
  hostname === "example.com" || hostname.endsWith(".example.com");

const isLoopbackHost = (hostname: string) =>
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";

const normalizeEnvString = (value: string | undefined | null) => {
  let out = typeof value === "string" ? value : "";
  const stripSpace = (s: string) =>
    s.replace(/^[\s\u200B\uFEFF]+|[\s\u200B\uFEFF]+$/g, "");
  out = stripSpace(out);
  if (out.length === 0) return out;
  const wrappers = new Set(["`", '"', "'"]);
  while (out.length > 0) {
    const prev = out;
    while (out.length > 0 && wrappers.has(out[0])) out = out.slice(1);
    while (out.length > 0 && wrappers.has(out[out.length - 1]))
      out = out.slice(0, -1);
    out = stripSpace(out);
    if (out === prev) break;
  }
  return out;
};

const toBackendApiBase = (value: string | undefined | null): string | null => {
  const raw = normalizeEnvString(value);
  if (!raw) return null;
  const clean = raw.replace(/\/$/, "");
  return clean.toLowerCase().endsWith("/api/v1") ? clean : `${clean}/api/v1`;
};

const toEditorOrigin = (value: string | undefined | null): string | null => {
  const raw = normalizeEnvString(value);
  if (!raw) return null;

  const candidates = [raw];
  const needsScheme = !/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(raw);
  if (needsScheme) {
    const scheme =
      raw.startsWith("localhost") || raw.startsWith("127.0.0.1")
        ? "http://"
        : "https://";
    candidates.push(`${scheme}${raw}`);
  }

  for (const candidate of candidates) {
    try {
      const url = new URL(candidate);
      if (url.protocol !== "http:" && url.protocol !== "https:") continue;
      if (isPlaceholderEditorHost(url.hostname)) return null;
      return url.origin;
    } catch {
      // continue
    }
  }

  return null;
};

export default function CampaignEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRedirectedRef = useRef(false);
  const hasWarnedAuth401Ref = useRef(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState<
    "none" | "native" | "pseudo"
  >("none");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const campaignId = (searchParams?.get("campaign") ?? "").trim();
  const returnTo = (searchParams?.get("returnTo") ?? "").trim();

  const editorSessionQuery = useQuery({
    queryKey: ["campaigns", "editor-session", campaignId],
    queryFn: () => campaignsService.getEditorSession(campaignId),
    enabled: campaignId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: (query) => {
      const data = query.state.data as unknown;
      const expiresAtRaw = isJsonObject(data) ? data.expiresAt : undefined;
      if (
        typeof expiresAtRaw !== "string" ||
        expiresAtRaw.trim().length === 0
      ) {
        return false;
      }
      const expiresAtMs = new Date(expiresAtRaw).getTime();
      if (!Number.isFinite(expiresAtMs)) return 60_000;
      const msUntilExpiry = expiresAtMs - Date.now();
      const refreshIn = msUntilExpiry - 30_000;
      const clamped = Math.min(Math.max(refreshIn, 15_000), 5 * 60_000);
      return clamped;
    },
    refetchIntervalInBackground: true,
  });

  const editorSessionData = useMemo(() => {
    const raw = editorSessionQuery.data as unknown;
    if (!isJsonObject(raw)) return null;
    const level1 = isJsonObject(raw.data) ? raw.data : raw;
    const level2 = isJsonObject(level1.data) ? level1.data : level1;
    return isJsonObject(level2) ? level2 : null;
  }, [editorSessionQuery.data]);

  const pickStringField = useCallback(
    (obj: Record<string, unknown> | null, keys: string[]) => {
      if (!obj) return undefined;
      for (const key of keys) {
        const raw = obj[key];
        if (typeof raw !== "string") continue;
        const cleaned = normalizeEnvString(raw);
        if (cleaned.length > 0) return cleaned;
      }
      return undefined;
    },
    []
  );

  const editorSessionEditorUrl = pickStringField(editorSessionData, [
    "editorUrl",
    "editorURL",
    "url",
    "sessionUrl",
    "sessionURL",
  ]);
  const editorSessionToken = pickStringField(editorSessionData, [
    "token",
    "sessionToken",
    "editorToken",
    "accessToken",
    "jwt",
  ]);
  const editorSessionExpiresAt = pickStringField(editorSessionData, [
    "expiresAt",
    "expires_at",
    "expires",
  ]);

  useEffect(() => {
    if (!campaignId) return;
    if (!editorSessionQuery.isError) return;
    const err = editorSessionQuery.error;
    const message =
      err instanceof Error ? err.message : "Failed to start editor session";
    toast.error(message);
  }, [campaignId, editorSessionQuery.error, editorSessionQuery.isError]);

  useEffect(() => {
    if (!campaignId) return;
    const tokenLength =
      typeof editorSessionToken === "string" ? editorSessionToken.length : 0;
    if (
      editorSessionQuery.isSuccess &&
      (!editorSessionToken || tokenLength === 0)
    ) {
      toast.error(
        "Editor session started but no token was returned by the API."
      );
    }
  }, [
    campaignId,
    editorSessionEditorUrl,
    editorSessionExpiresAt,
    editorSessionQuery.isSuccess,
    editorSessionToken,
  ]);

  const editorOrigin = useMemo(() => {
    const configured = toEditorOrigin(
      process.env.NEXT_PUBLIC_EMAIL_EDITOR_ORIGIN
    );
    if (configured) return configured;

    const fromSession = toEditorOrigin(editorSessionEditorUrl);
    if (editorSessionQuery.isSuccess && fromSession) return fromSession;

    return process.env.NODE_ENV === "production"
      ? DEFAULT_EDITOR_ORIGIN_PROD
      : DEFAULT_EDITOR_ORIGIN_DEV;
  }, [editorSessionEditorUrl, editorSessionQuery.isSuccess]);

  const allowedOrigins = useMemo(() => {
    const fromSession =
      editorSessionQuery.isSuccess && editorSessionEditorUrl
        ? (() => {
            try {
              return new URL(String(editorSessionEditorUrl)).origin;
            } catch {
              return null;
            }
          })()
        : null;
    return new Set<string>([
      DEFAULT_EDITOR_ORIGIN_PROD,
      DEFAULT_EDITOR_ORIGIN_DEV,
      editorOrigin,
      ...(fromSession ? [fromSession] : []),
    ]);
  }, [editorOrigin, editorSessionEditorUrl, editorSessionQuery.isSuccess]);

  const apiBaseUrlForEditor = useMemo(() => {
    if (typeof window === "undefined") return null;
    const localProxy = `${window.location.origin}/api/v1`;

    let hostHostname = "";
    try {
      hostHostname = new URL(window.location.origin).hostname;
    } catch {
      hostHostname = window.location.hostname;
    }

    if (!isLoopbackHost(hostHostname)) return localProxy;

    const editorIsLoopback = (() => {
      try {
        return isLoopbackHost(new URL(editorOrigin).hostname);
      } catch {
        return false;
      }
    })();
    if (editorIsLoopback) return localProxy;

    return (
      toBackendApiBase(process.env.NEXT_PUBLIC_BACKEND_URL) ??
      toBackendApiBase(process.env.BACKEND_URL) ??
      DEFAULT_BACKEND_API_BASE_PROD
    );
  }, [editorOrigin]);

  const iframeSrc = useMemo(() => {
    if (!campaignId) return "";
    const sessionUrl =
      editorSessionQuery.isSuccess && editorSessionEditorUrl
        ? String(editorSessionEditorUrl)
        : null;
    const hostOrigin =
      typeof window !== "undefined" ? window.location.origin : null;
    const apiBaseUrl =
      typeof apiBaseUrlForEditor === "string"
        ? normalizeEnvString(apiBaseUrlForEditor)
        : null;
    const orgId = getSelectedOrganizationId();
    const token =
      editorSessionQuery.isSuccess && editorSessionToken
        ? String(editorSessionToken)
        : null;

    if (sessionUrl) {
      try {
        const url = new URL(sessionUrl);
        if (!isPlaceholderEditorHost(url.hostname)) {
          if (url.origin !== editorOrigin) {
            throw new Error("Editor session URL origin mismatch");
          }
          url.searchParams.set("campaign", campaignId);
          url.searchParams.set("campaignId", campaignId);
          url.searchParams.set("campaign_id", campaignId);
          url.searchParams.set("id", campaignId);
          url.searchParams.set("campaign.id", campaignId);
          url.searchParams.set("embedded", "true");
          if (hostOrigin) {
            url.searchParams.set("hostOrigin", hostOrigin);
            url.searchParams.set("parentOrigin", hostOrigin);
            url.searchParams.set("appOrigin", hostOrigin);
            url.searchParams.set("targetOrigin", hostOrigin);
          }
          if (apiBaseUrl) {
            url.searchParams.set("apiBaseUrl", apiBaseUrl);
            url.searchParams.set("baseUrl", apiBaseUrl);
            url.searchParams.set("backendBaseUrl", apiBaseUrl);
          }
          if (orgId) {
            url.searchParams.set("orgId", orgId);
            url.searchParams.set("xOrgId", orgId);
            url.searchParams.set("organizationId", orgId);
            url.searchParams.set("activeOrganizationId", orgId);
            url.searchParams.set("x-org-id", orgId);
            url.searchParams.set("org.id", orgId);
            url.searchParams.set("organization.id", orgId);
          }
          if (token) {
            url.searchParams.set("token", token);
            url.searchParams.set("sessionToken", token);
            url.searchParams.set("editorToken", token);
          }
          return url.toString();
        }
      } catch {
        // fall through
      }
    }

    try {
      const url = new URL("/", editorOrigin);
      url.searchParams.set("campaign", campaignId);
      url.searchParams.set("campaignId", campaignId);
      url.searchParams.set("campaign_id", campaignId);
      url.searchParams.set("id", campaignId);
      url.searchParams.set("campaign.id", campaignId);
      url.searchParams.set("embedded", "true");
      if (hostOrigin) {
        url.searchParams.set("hostOrigin", hostOrigin);
        url.searchParams.set("parentOrigin", hostOrigin);
        url.searchParams.set("appOrigin", hostOrigin);
        url.searchParams.set("targetOrigin", hostOrigin);
      }
      if (apiBaseUrl) {
        url.searchParams.set("apiBaseUrl", apiBaseUrl);
        url.searchParams.set("baseUrl", apiBaseUrl);
        url.searchParams.set("backendBaseUrl", apiBaseUrl);
      }
      if (orgId) {
        url.searchParams.set("orgId", orgId);
        url.searchParams.set("xOrgId", orgId);
        url.searchParams.set("organizationId", orgId);
        url.searchParams.set("activeOrganizationId", orgId);
        url.searchParams.set("x-org-id", orgId);
        url.searchParams.set("org.id", orgId);
        url.searchParams.set("organization.id", orgId);
      }
      if (token) {
        url.searchParams.set("token", token);
        url.searchParams.set("sessionToken", token);
        url.searchParams.set("editorToken", token);
      }
      return url.toString();
    } catch {
      return "";
    }
  }, [
    campaignId,
    apiBaseUrlForEditor,
    editorOrigin,
    editorSessionEditorUrl,
    editorSessionToken,
    editorSessionQuery.isSuccess,
  ]);

  useEffect(() => {
    setIframeFailed(false);
    setIframeLoaded(false);
  }, [iframeSrc]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const active = document.fullscreenElement === containerRef.current;
      setFullscreenMode((prev) => {
        if (active) return "native";
        if (prev === "native") return "none";
        return prev;
      });
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (fullscreenMode !== "pseudo") return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [fullscreenMode]);

  useEffect(() => {
    if (fullscreenMode !== "pseudo") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenMode("none");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullscreenMode]);

  const toggleFullscreen = async () => {
    if (fullscreenMode === "native") {
      if (document.fullscreenElement) await document.exitFullscreen();
      return;
    }

    if (fullscreenMode === "pseudo") {
      setFullscreenMode("none");
      return;
    }

    const el = containerRef.current;
    const canNative =
      typeof document !== "undefined" &&
      typeof el?.requestFullscreen === "function";
    if (canNative) {
      try {
        if (!el) return;
        await el.requestFullscreen();
        return;
      } catch (e) {
        String(e);
      }
    }

    setFullscreenMode("pseudo");
  };

  const iframeDiagnostics = useMemo(() => {
    if (!iframeSrc) return null;
    try {
      const url = new URL(iframeSrc);
      return { origin: url.origin, hostname: url.hostname };
    } catch {
      return null;
    }
  }, [iframeSrc]);

  const postIframeConfig = useCallback(
    (opts?: {
      targetWindow?: Window | null;
      targetOrigin?: string | null;
      requestId?: string | null;
    }) => {
      const token =
        editorSessionQuery.isSuccess && editorSessionToken
          ? String(editorSessionToken)
          : null;
      const apiBaseUrl =
        typeof apiBaseUrlForEditor === "string"
          ? normalizeEnvString(apiBaseUrlForEditor)
          : null;
      const hostOrigin =
        typeof window !== "undefined" ? window.location.origin : null;
      const postTargetOrigin = "*";
      const orgId = getSelectedOrganizationId();

      const hostConfig = {
        embedded: true,
        id: campaignId,
        campaignId,
        campaign: campaignId,
        orgId,
        token,
        apiBaseUrl: apiBaseUrl ?? undefined,
        sessionToken: token,
        editorToken: token,
        baseUrl: apiBaseUrl ?? undefined,
        backendBaseUrl: apiBaseUrl ?? undefined,
        hostOrigin: hostOrigin ?? undefined,
      };

      try {
        const win = opts?.targetWindow ?? iframeRef.current?.contentWindow;
        win?.postMessage(
          { type: "HOST_CONFIG", ...hostConfig },
          postTargetOrigin
        );
        win?.postMessage(
          {
            type: "HOST_CONFIG",
            hostConfig,
            requestId: opts?.requestId ?? undefined,
          },
          postTargetOrigin
        );
      } catch (e) {
        String(e);
      }
    },
    [
      apiBaseUrlForEditor,
      campaignId,
      editorOrigin,
      editorSessionExpiresAt,
      editorSessionQuery.isSuccess,
      editorSessionToken,
      iframeDiagnostics?.origin,
    ]
  );

  useEffect(() => {
    if (!iframeLoaded) return;
    if (!campaignId) return;

    postIframeConfig();

    const timeouts = [150, 500, 1200].map((ms) =>
      window.setTimeout(() => postIframeConfig(), ms)
    );
    return () => {
      for (const id of timeouts) window.clearTimeout(id);
    };
  }, [
    campaignId,
    editorOrigin,
    editorSessionQuery.isSuccess,
    editorSessionToken,
    iframeDiagnostics?.origin,
    iframeLoaded,
    postIframeConfig,
  ]);

  const nextWizardUrl = useMemo(() => {
    const base = returnTo.length > 0 ? returnTo : "/campaigns/new";
    const url = new URL(base, "http://localhost");
    url.searchParams.set("step", "4");
    if (campaignId) url.searchParams.set("campaign", campaignId);
    return `${url.pathname}?${url.searchParams.toString()}`;
  }, [campaignId, returnTo]);

  useEffect(() => {
    const sanitizeAuthDebug = (value: Record<string, unknown>) => {
      const removed = new Set([
        "authorization",
        "Authorization",
        "token",
        "editorToken",
        "bearer",
        "headers",
        "requestHeaders",
        "responseHeaders",
      ]);
      return Object.fromEntries(
        Object.entries(value).filter(([key]) => !removed.has(key))
      );
    };

    const handleMessage = (event: MessageEvent) => {
      const { data: messageData, origin } = event;
      const originClean = normalizeEnvString(origin);
      const fromIframe =
        Boolean(iframeRef.current?.contentWindow) &&
        event.source === iframeRef.current?.contentWindow;
      const originAllowed =
        allowedOrigins.has(originClean) ||
        (fromIframe &&
          (originClean === "null" ||
            originClean.endsWith(".onchainsuite.com") ||
            originClean === "http://localhost:3000" ||
            originClean === "http://127.0.0.1:3000"));
      if (!originAllowed) return;

      if (!isJsonObject(messageData)) return;

      const messageType =
        typeof messageData.type === "string" ? messageData.type : "";
      const requestId =
        typeof messageData.requestId === "string"
          ? messageData.requestId
          : null;
      const looksLikeConfigRequest =
        messageType === "REQUEST_HOST_CONFIG" ||
        messageType === "EDITOR_READY" ||
        messageType === "EMAIL_EDITOR_READY" ||
        messageType === "EMAIL_EDITOR_REQUEST_HOST_CONFIG" ||
        messageType.endsWith("REQUEST_HOST_CONFIG") ||
        messageType.endsWith("EDITOR_READY");

      if (looksLikeConfigRequest) {
        const sourceWindow =
          event.source &&
          typeof (event.source as Window).postMessage === "function"
            ? (event.source as Window)
            : null;
        postIframeConfig({
          targetWindow: sourceWindow,
          targetOrigin: originClean,
          requestId,
        });
        if (requestId) {
          try {
            sourceWindow?.postMessage(
              { type: "HOST_CONFIG_ACK", requestId },
              "*"
            );
          } catch (e) {
            String(e);
          }
        }
        return;
      }

      if (messageData.type === "EMAIL_AUTH_DEBUG") {
        const safe = sanitizeAuthDebug(messageData);
        const hasAuthorization = safe.hasAuthorization === true;
        const hasOrgId = safe.hasOrgId === true;
        const expiresAtIso =
          editorSessionQuery.isSuccess &&
          typeof editorSessionExpiresAt === "string"
            ? editorSessionExpiresAt
            : null;
        const expiresAtMs = expiresAtIso
          ? new Date(expiresAtIso).getTime()
          : NaN;
        const isExpired = Number.isFinite(expiresAtMs)
          ? Date.now() >= expiresAtMs
          : null;
        const status =
          typeof safe.status === "number"
            ? safe.status
            : typeof safe.statusCode === "number"
              ? safe.statusCode
              : null;

        if (
          status === 401 &&
          hasAuthorization &&
          hasOrgId &&
          !hasWarnedAuth401Ref.current
        ) {
          hasWarnedAuth401Ref.current = true;
          toast.error(
            isExpired === true
              ? "Editor token appears expired; refresh the editor session token (it is short-lived) and retry."
              : "Editor requests are still getting 401 even though Authorization + orgId are present. This almost always means the token is wrong (not the editor-session token) or expired."
          );
        }
        return;
      }

      if (messageData.type === "EMAIL_SAVED" && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        toast.success("Email saved");
        router.push(nextWizardUrl);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [
    allowedOrigins,
    editorSessionExpiresAt,
    editorSessionQuery.isSuccess,
    nextWizardUrl,
    postIframeConfig,
    router,
  ]);

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4">
        {!campaignId ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Missing campaign id.
          </div>
        ) : (
          <div
            ref={containerRef}
            className={cn(
              "relative overflow-hidden border border-border bg-background shadow-sm",
              fullscreenMode === "none"
                ? "h-[calc(100vh-120px)] rounded-2xl"
                : "fixed inset-0 z-50 h-screen w-screen rounded-none border-0"
            )}
          >
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-3 top-3 z-20 h-9 w-9 rounded-full shadow-sm"
              onClick={toggleFullscreen}
              aria-label={
                fullscreenMode === "none"
                  ? "Enter fullscreen"
                  : "Exit fullscreen"
              }
            >
              {fullscreenMode === "none" ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>

            {iframeFailed ? (
              <div className="absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center gap-3 bg-background px-6 text-center">
                <div className="text-sm font-medium">
                  Editor failed to load.
                </div>
                <div className="text-xs text-muted-foreground">
                  {iframeDiagnostics?.origin
                    ? `Tried: ${iframeDiagnostics.origin}`
                    : "The editor URL is invalid."}
                </div>
                {iframeSrc ? (
                  <a
                    className="text-xs text-primary underline underline-offset-2"
                    href={iframeSrc}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open editor URL
                  </a>
                ) : null}
              </div>
            ) : null}
            <iframe
              key={iframeSrc}
              src={iframeSrc}
              title="Email editor"
              className="h-full w-full"
              style={{ border: "none" }}
              referrerPolicy="strict-origin-when-cross-origin"
              ref={iframeRef}
              onLoad={() => {
                setIframeFailed(false);
                setIframeLoaded(true);
                postIframeConfig();
              }}
              onError={() => setIframeFailed(true)}
              allow="fullscreen"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
