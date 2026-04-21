"use client";

import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";

import type { CampaignFormData } from "../../validations";
import { EmailMessageForm } from "./email-message-form";
import { TemplateSelector } from "./template-selector";

interface TemplateStepProps {
  form: UseFormReturn<CampaignFormData>;
  campaignId?: string;
}

export function TemplateStep({ form, campaignId }: TemplateStepProps) {
  const router = useRouter();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid lg:grid-cols-[1fr_420px] gap-0 divide-x divide-border">
        <TemplateSelector
          form={form}
          onCreateEditor={() => {
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

            router.push(`/campaigns/editor?${params.toString()}`);
          }}
        />
        <EmailMessageForm form={form} />
      </div>
    </div>
  );
}
