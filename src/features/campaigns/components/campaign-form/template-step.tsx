"use client";

import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

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
}: TemplateStepProps) {
  const router = useRouter();

  const normalizedCampaignId = useMemo(
    () => (campaignId && campaignId.trim().length > 0 ? campaignId.trim() : ""),
    [campaignId]
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 md:p-8 lg:p-10">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20">
          <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            Message & Template
          </h2>
          <p className="text-base text-muted-foreground text-pretty">
            Craft your email and pick the template your audience will receive
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <EmailMessageForm
            form={form}
            verifiedSenderIdentities={verifiedSenderIdentities}
            senderIdentitiesLoading={senderIdentitiesLoading}
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
    </div>
  );
}
