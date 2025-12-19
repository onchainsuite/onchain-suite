"use client";

import type { UseFormReturn } from "react-hook-form";

import type { CampaignFormData } from "../../validations";
import { EmailMessageForm } from "./email-message-form";
import { TemplateSelector } from "./template-selector";

interface TemplateStepProps {
  form: UseFormReturn<CampaignFormData>;
}

export function TemplateStep({ form }: TemplateStepProps) {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid lg:grid-cols-[1fr_400px] gap-0 divide-x divide-border">
        <TemplateSelector form={form} />
        <EmailMessageForm form={form} />
      </div>
    </div>
  );
}
