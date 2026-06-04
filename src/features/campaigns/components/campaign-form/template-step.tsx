"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Input } from "@/ui/input";

import { campaignsService } from "../../campaigns.service";
import type { CampaignFormData } from "../../validations";
import { EmailMessageForm } from "./email-message-form";
import { TemplateSelector } from "./template-selector";

interface TemplateStepProps {
  form: UseFormReturn<CampaignFormData>;
  campaignId?: string;
}

export function TemplateStep({ form, campaignId }: TemplateStepProps) {
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<"html" | "text">("html");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewText, setPreviewText] = useState<string>("");
  const [testTo, setTestTo] = useState("");

  const normalizedCampaignId = useMemo(
    () => (campaignId && campaignId.trim().length > 0 ? campaignId.trim() : ""),
    [campaignId]
  );

  const previewMutation = useMutation({
    mutationFn: async () => {
      if (!normalizedCampaignId) throw new Error("Missing campaign id.");
      try {
        const preview = await campaignsService.preview(normalizedCampaignId);
        const html =
          typeof preview.html === "string" ? preview.html.trim() : "";
        const text =
          typeof preview.text === "string" ? preview.text.trim() : "";
        if (html.length > 0 || text.length > 0) return preview;
      } catch (_e) {
        String(_e);
      }

      const editor = await campaignsService.getEditorContent(
        normalizedCampaignId
      );
      const html = typeof editor.html === "string" ? editor.html : "";
      const text =
        typeof editor.textVersion === "string" ? editor.textVersion : "";
      if (html.trim().length === 0 && text.trim().length === 0) {
        throw new Error("No email content is available to preview.");
      }
      return { html, text };
    },
    onSuccess: (data) => {
      setPreviewHtml(typeof data.html === "string" ? data.html : "");
      setPreviewText(typeof data.text === "string" ? data.text : "");
      setPreviewTab("html");
      setPreviewOpen(true);
    },
    onError: (e: unknown) => {
      const message =
        e instanceof Error ? e.message : "Failed to generate preview";
      toast.error(message);
    },
  });

  const sendTestMutation = useMutation({
    mutationFn: async (payload: { to: string }) => {
      if (!normalizedCampaignId) throw new Error("Missing campaign id.");
      const subjectOverrideRaw = form.getValues("emailSubject");
      const subjectOverride =
        typeof subjectOverrideRaw === "string" &&
        subjectOverrideRaw.trim().length > 0
          ? subjectOverrideRaw.trim()
          : undefined;
      await campaignsService.sendTest(
        normalizedCampaignId,
        subjectOverride ? { ...payload, subjectOverride } : payload
      );
    },
    onSuccess: () => {
      toast.success("Test email sent");
    },
    onError: (e: unknown) => {
      const message =
        e instanceof Error ? e.message : "Failed to send test email";
      toast.error(message);
    },
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <EmailMessageForm form={form} />
          <div className="border-t border-border bg-card p-4">
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium text-foreground">
                Preview & Test
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  disabled={!normalizedCampaignId || previewMutation.isPending}
                  onClick={() => previewMutation.mutate()}
                >
                  {previewMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Generate preview"
                  )}
                </Button>

                <div className="flex min-w-[220px] flex-1 items-center gap-2">
                  <Input
                    value={testTo}
                    onChange={(e) => setTestTo(e.target.value)}
                    placeholder="Test recipient email"
                    className="h-10 rounded-xl bg-background"
                  />
                  <Button
                    type="button"
                    className="rounded-xl"
                    disabled={
                      !normalizedCampaignId ||
                      sendTestMutation.isPending ||
                      testTo.trim().length === 0
                    }
                    onClick={() =>
                      sendTestMutation.mutate({ to: testTo.trim() })
                    }
                  >
                    {sendTestMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Send test"
                    )}
                  </Button>
                </div>
              </div>
              {!normalizedCampaignId && (
                <div className="text-xs text-muted-foreground">
                  Create the campaign draft first to enable preview/test.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <TemplateSelector
            form={form}
            onSelectTemplate={(templateId) => {
              if (!normalizedCampaignId) return;
              const clean = templateId.trim();
              if (!clean) return;
              campaignsService
                .setTemplate(normalizedCampaignId, { templateId: clean })
                .catch((e: unknown) => {
                  const message =
                    e instanceof Error
                      ? e.message
                      : "Failed to apply template";
                  toast.error(message);
                });
            }}
            onCreateEditor={(opts) => {
              const params = new URLSearchParams();
              const normalizedCampaignId =
                campaignId && campaignId.trim().length > 0
                  ? campaignId
                  : undefined;
              if (campaignId && campaignId.trim().length > 0) {
                params.set("campaign", campaignId);
              }
              const returnTo = normalizedCampaignId
                ? `/campaigns/new?campaign=${encodeURIComponent(normalizedCampaignId)}&step=3`
                : "/campaigns/new?step=3";
              params.set("returnTo", returnTo);

              const subject = form.getValues("emailSubject");
              const senderName = form.getValues("senderName");
              const senderEmail = form.getValues("senderEmail");

              if (subject) params.set("subject", subject);
              if (senderName) params.set("senderName", senderName);
              if (senderEmail) params.set("senderEmail", senderEmail);
              if (opts?.templateName) params.set("templateName", opts.templateName);

              router.push(`/campaigns/editor?${params.toString()}`);
            }}
          />
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Campaign preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={previewTab === "html" ? "default" : "outline"}
              className="rounded-xl"
              onClick={() => setPreviewTab("html")}
            >
              HTML
            </Button>
            <Button
              type="button"
              variant={previewTab === "text" ? "default" : "outline"}
              className="rounded-xl"
              onClick={() => setPreviewTab("text")}
            >
              Plain text
            </Button>
          </div>
          {previewTab === "html" ? (
            <div className="h-[70vh] overflow-hidden rounded-xl border border-border">
              <iframe
                title="HTML preview"
                srcDoc={previewHtml}
                className="h-full w-full bg-white"
                style={{ border: "none" }}
              />
            </div>
          ) : (
            <pre className="h-[70vh] overflow-auto rounded-xl border border-border bg-muted p-4 text-sm text-foreground whitespace-pre-wrap">
              {previewText.length > 0
                ? previewText
                : "No text preview available."}
            </pre>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
