"use client";

import { Loading02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Input } from "@/ui/input";

import { extractEmailContent } from "@/lib/utils";

import { campaignsService } from "../../campaigns.service";
import type { CampaignFormData } from "../../validations";
import { EmailMessageForm } from "./email-message-form";
import { TemplateSelector } from "./template-selector";

export interface TemplateStepProps {
  form: UseFormReturn<CampaignFormData>;
  campaignId?: string;
  verifiedSenderIdentities: Array<{
    id: string;
    email: string;
    name: string;
    isDefault: boolean;
  }>;
  senderIdentitiesLoading: boolean;
  canSendEmail: boolean;
}

export function TemplateStep({
  form,
  campaignId,
  verifiedSenderIdentities,
  senderIdentitiesLoading,
  canSendEmail,
}: TemplateStepProps) {
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

  const getRenderRequest = () => {
    const values = form.getValues();
    const subject = values.emailSubject?.trim();
    const previewText = values.previewText?.trim();
    const senderName = values.senderName?.trim();
    const senderEmail = values.senderEmail?.trim();
    const replyToEmail = values.replyToEmail?.trim();

    return {
      subject: subject && subject.length > 0 ? subject : undefined,
      previewText:
        previewText && previewText.length > 0 ? previewText : undefined,
      senderName: senderName && senderName.length > 0 ? senderName : undefined,
      senderEmail:
        senderEmail && senderEmail.length > 0 ? senderEmail : undefined,
      replyToEmail:
        values.useReplyTo && replyToEmail && replyToEmail.length > 0
          ? replyToEmail
          : undefined,
    };
  };

  const getCanonicalPreview = async () => {
    if (!normalizedCampaignId) throw new Error("Missing campaign id.");

    const preview = await campaignsService.preview(
      normalizedCampaignId,
      getRenderRequest()
    );
    const extracted = extractEmailContent(preview);
    if (
      (extracted.html?.trim().length ?? 0) > 0 ||
      (extracted.textVersion?.trim().length ?? 0) > 0
    ) {
      return {
        html: extracted.html ?? "",
        text: extracted.textVersion ?? "",
      };
    }

    try {
      const email =
        await campaignsService.getEmailContent(normalizedCampaignId);
      const extracted = extractEmailContent(email);
      if (
        (extracted.html?.trim().length ?? 0) > 0 ||
        (extracted.textVersion?.trim().length ?? 0) > 0
      ) {
        return {
          html: extracted.html ?? "",
          text: extracted.textVersion ?? "",
        };
      }
    } catch (_e) {
      String(_e);
    }
    throw new Error(
      "This campaign has no rendered email content yet. Save or regenerate the email before previewing or sending."
    );
  };

  const previewMutation = useMutation({
    mutationFn: getCanonicalPreview,
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
      await campaignsService.sendTest(normalizedCampaignId, {
        ...payload,
        ...getRenderRequest(),
      });
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
          <EmailMessageForm
            form={form}
            verifiedSenderIdentities={verifiedSenderIdentities}
            senderIdentitiesLoading={senderIdentitiesLoading}
          />
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
                    <HugeiconsIcon
                      icon={Loading02Icon}
                      className="h-4 w-4 animate-spin"
                    />
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
                      testTo.trim().length === 0 ||
                      !canSendEmail
                    }
                    onClick={() =>
                      sendTestMutation.mutate({ to: testTo.trim() })
                    }
                  >
                    {sendTestMutation.isPending ? (
                      <HugeiconsIcon
                        icon={Loading02Icon}
                        className="h-4 w-4 animate-spin"
                      />
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
              {normalizedCampaignId && !canSendEmail ? (
                <div className="text-xs text-muted-foreground">
                  Your role cannot send test emails for this organization.
                </div>
              ) : null}
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
                    e instanceof Error ? e.message : "Failed to apply template";
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
              if (opts?.templateName)
                params.set("templateName", opts.templateName);

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
            <div className="h-[70vh] overflow-hidden rounded-xl border border-border bg-white">
              <iframe
                title="HTML preview"
                srcDoc={previewHtml}
                sandbox="allow-same-origin allow-scripts"
                className="h-full w-full"
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
