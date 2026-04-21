"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";

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

  const editorOrigin = useMemo(() => {
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
  }, []);

  const allowedOrigins = useMemo(() => {
    return new Set<string>([
      DEFAULT_EDITOR_ORIGIN_PROD,
      DEFAULT_EDITOR_ORIGIN_DEV,
      editorOrigin,
    ]);
  }, [editorOrigin]);

  const iframeSrc = useMemo(() => {
    if (!campaignId) return "";
    const url = new URL("/", editorOrigin);
    url.searchParams.set("campaign", campaignId);
    url.searchParams.set("embedded", "true");
    return url.toString();
  }, [campaignId, editorOrigin]);

  const nextWizardUrl = useMemo(() => {
    const base = returnTo.length > 0 ? returnTo : "/campaigns/new";
    const url = new URL(base, "http://localhost");
    url.searchParams.set("step", "4");
    if (campaignId) url.searchParams.set("campaign", campaignId);
    return `${url.pathname}?${url.searchParams.toString()}`;
  }, [campaignId, returnTo]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!allowedOrigins.has(event.origin)) return;

      const data = event.data as any;
      if (!data || typeof data !== "object") return;

      if (data.type === "EMAIL_SAVED" && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        toast.success("Email saved");
        router.push(nextWizardUrl);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [allowedOrigins, nextWizardUrl, router]);

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
