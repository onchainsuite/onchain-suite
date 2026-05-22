"use client";

import { useQuery } from "@tanstack/react-query";
import { Maximize2, Minimize2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { cn, getSelectedOrganizationId, isJsonObject } from "@/lib/utils";

import { campaignsService } from "@/features/campaigns/campaigns.service";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.CAMPAIGNS, label: "Campaigns" },
];

const DEFAULT_EDITOR_ORIGIN_PROD = "https://editor.onchainsuite.com";
const DEFAULT_EDITOR_ORIGIN_DEV = "https://email-builder-js-ycf8.onrender.com";

const isPlaceholderEditorHost = (hostname: string) =>
  hostname === "example.com" || hostname.endsWith(".example.com");

const toEditorOrigin = (value: string | undefined | null): string | null => {
  const raw = typeof value === "string" ? value.trim() : "";
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
  const [iframeFailed, setIframeFailed] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState<
    "none" | "native" | "pseudo"
  >("none");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const campaignId = (searchParams.get("campaign") ?? "").trim();
  const returnTo = (searchParams.get("returnTo") ?? "").trim();

  const editorSessionQuery = useQuery({
    queryKey: ["campaigns", "editor-session", campaignId],
    queryFn: () => campaignsService.getEditorSession(campaignId),
    enabled: campaignId.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const editorSessionEditorUrl = editorSessionQuery.data?.editorUrl;
  const editorSessionToken = editorSessionQuery.data?.token;

  const editorOrigin = useMemo(() => {
    const fromSession = toEditorOrigin(editorSessionEditorUrl);
    if (editorSessionQuery.isSuccess && fromSession) return fromSession;

    const configured = toEditorOrigin(
      process.env.NEXT_PUBLIC_EMAIL_EDITOR_ORIGIN
    );
    if (configured) return configured;

    return process.env.NODE_ENV === "production"
      ? DEFAULT_EDITOR_ORIGIN_PROD
      : DEFAULT_EDITOR_ORIGIN_DEV;
  }, [editorSessionEditorUrl, editorSessionQuery.isSuccess]);

  const allowedOrigins = useMemo(() => {
    const fromSession =
      editorSessionQuery.isSuccess && editorSessionQuery.data?.editorUrl
        ? (() => {
            try {
              return new URL(String(editorSessionQuery.data.editorUrl)).origin;
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
  }, [editorOrigin, editorSessionQuery.data, editorSessionQuery.isSuccess]);

  const iframeSrc = useMemo(() => {
    if (!campaignId) return "";
    const sessionUrl =
      editorSessionQuery.isSuccess && editorSessionQuery.data?.editorUrl
        ? String(editorSessionQuery.data.editorUrl)
        : null;
    const apiBaseUrl =
      typeof window !== "undefined" ? `${window.location.origin}/api/v1` : null;
    const orgId = getSelectedOrganizationId();

    if (sessionUrl) {
      try {
        const url = new URL(sessionUrl);
        if (!isPlaceholderEditorHost(url.hostname)) {
          url.searchParams.set("campaign", campaignId);
          url.searchParams.set("embedded", "true");
          if (apiBaseUrl) url.searchParams.set("apiBaseUrl", apiBaseUrl);
          if (orgId) url.searchParams.set("orgId", orgId);
          return url.toString();
        }
      } catch {
        // fall through
      }
    }

    try {
      const url = new URL("/", editorOrigin);
      url.searchParams.set("campaign", campaignId);
      url.searchParams.set("embedded", "true");
      if (apiBaseUrl) url.searchParams.set("apiBaseUrl", apiBaseUrl);
      if (orgId) url.searchParams.set("orgId", orgId);
      return url.toString();
    } catch {
      return "";
    }
  }, [
    campaignId,
    editorOrigin,
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
        await el!.requestFullscreen();
        return;
      } catch {
        // fall through
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

  const postIframeConfig = () => {
    const token =
      editorSessionQuery.isSuccess && editorSessionToken
        ? String(editorSessionToken)
        : null;
    const apiBaseUrl =
      typeof window !== "undefined" ? `${window.location.origin}/api/v1` : null;
    const targetOrigin = iframeDiagnostics?.origin ?? editorOrigin;
    const orgId = getSelectedOrganizationId();

    const payload = {
      type: "HOST_CONFIG",
      campaign: campaignId,
      campaignId,
      orgId,
      token,
      apiBaseUrl,
      embedded: true,
    };

    try {
      iframeRef.current?.contentWindow?.postMessage(payload, targetOrigin);
    } catch {
      // ignore
    }
  };

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
  ]);

  const nextWizardUrl = useMemo(() => {
    const base = returnTo.length > 0 ? returnTo : "/campaigns/new";
    const url = new URL(base, "http://localhost");
    url.searchParams.set("step", "4");
    if (campaignId) url.searchParams.set("campaign", campaignId);
    return `${url.pathname}?${url.searchParams.toString()}`;
  }, [campaignId, returnTo]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data: messageData, origin } = event;
      if (!allowedOrigins.has(origin)) return;

      if (!isJsonObject(messageData)) return;

      if (
        messageData.type === "REQUEST_HOST_CONFIG" ||
        messageData.type === "EDITOR_READY"
      ) {
        if (event.source !== iframeRef.current?.contentWindow) return;
        postIframeConfig();
        return;
      }

      if (messageData.type === "EMAIL_SAVED" && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        toast.success("Email saved");
        router.push(nextWizardUrl);
      }
    };

    window.addEventListener("message", handleMessage);
  }, [allowedOrigins, nextWizardUrl, router]);

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
              allowFullScreen
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
