"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";

import { isJsonObject } from "@/lib/utils";

import { campaignsService } from "@/features/campaigns/campaigns.service";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.CAMPAIGNS, label: "Campaigns" },
];

const DEFAULT_EDITOR_ORIGIN_PROD = "https://editor.onchainsuite.com";
const DEFAULT_EDITOR_ORIGIN_DEV = "https://email-builder-js-ycf8.onrender.com";

export default function CampaignEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRedirectedRef = useRef(false);

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

  const editorOrigin = useMemo(() => {
    if (editorSessionQuery.isSuccess && editorSessionEditorUrl) {
      try {
        return new URL(String(editorSessionEditorUrl)).origin;
      } catch {
        return DEFAULT_EDITOR_ORIGIN_DEV;
      }
    }

    const configured = process.env.NEXT_PUBLIC_EMAIL_EDITOR_ORIGIN;
    if (configured && configured.trim().length > 0) {
      try {
        return new URL(configured).origin;
      } catch {
        return configured;
      }
    }

    if (process.env.NODE_ENV === "production")
      return DEFAULT_EDITOR_ORIGIN_PROD;
    return DEFAULT_EDITOR_ORIGIN_DEV;
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

    if (sessionUrl) {
      try {
        const url = new URL(sessionUrl);
        url.searchParams.set("campaign", campaignId);
        url.searchParams.set("embedded", "true");
        return url.toString();
      } catch {
        // fall through
      }
    }

    const url = new URL("/", editorOrigin);
    url.searchParams.set("campaign", campaignId);
    url.searchParams.set("embedded", "true");
    return url.toString();
  }, [
    campaignId,
    editorOrigin,
    editorSessionQuery.data,
    editorSessionQuery.isSuccess,
  ]);

  const nextWizardUrl = useMemo(() => {
    const base = returnTo.length > 0 ? returnTo : "/campaigns/new";
    const url = new URL(base, "http://localhost");
    url.searchParams.set("step", "4");
    if (campaignId) url.searchParams.set("campaign", campaignId);
    return `${url.pathname}?${url.searchParams.toString()}`;
  }, [campaignId, returnTo]);

  const saveMutation = useMutation({
    mutationFn: async (payload: unknown) => {
      const data = isJsonObject(payload) ? payload : {};
      await campaignsService.editorSaved(campaignId, {
        html: typeof data.html === "string" ? data.html : undefined,
        json: data.json ?? undefined,
        textVersion:
          typeof data.textVersion === "string" ? data.textVersion : undefined,
        assets: data.assets ?? undefined,
      });
    },
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data: messageData, origin } = event;
      if (!allowedOrigins.has(origin)) return;

      if (!isJsonObject(messageData)) return;

      if (messageData.type === "EMAIL_SAVED" && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        const payload =
          "payload" in messageData ? messageData.payload : undefined;
        saveMutation
          .mutateAsync(payload)
          .then(() => {
            toast.success("Email saved");
            router.push(nextWizardUrl);
          })
          .catch((e: unknown) => {
            hasRedirectedRef.current = false;
            const message = isJsonObject(e) ? e.message : undefined;
            toast.error(String(message ?? "Failed to save email"));
          });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [allowedOrigins, nextWizardUrl, router, saveMutation]);

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4">
        {!campaignId ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Missing campaign id.
          </div>
        ) : (
          <div className="h-[calc(100vh-120px)] overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
            <iframe
              key={iframeSrc}
              src={iframeSrc}
              title="Email editor"
              className="h-full w-full"
              style={{ border: "none" }}
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
