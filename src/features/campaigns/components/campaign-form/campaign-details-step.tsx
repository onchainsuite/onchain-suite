"use client";
import {
  AnalyticsUpIcon,
  Mail01Icon,
  Message01Icon,
  SentIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";

import type { CampaignFormData } from "../../validations";

interface CampaignDetailsStepProps {
  form: UseFormReturn<CampaignFormData>;
}

const CAMPAIGN_TYPE_OPTIONS = [
  {
    id: "email-blast",
    title: "Email Blast",
    description: "Send one-off campaigns or manage a batch of emails",
    icon: Mail01Icon,
  },
  {
    id: "drip-campaign",
    title: "Drip campaign",
    description: "Send messages at specific intervals in a specific audience",
    icon: AnalyticsUpIcon,
  },
  {
    id: "smart-sending",
    title: "Smart campaign",
    description: "Reach users across channels (in-app and social messaging)",
    icon: UserGroupIcon,
  },
];

export function CampaignDetailsStep({ form }: CampaignDetailsStepProps) {
  const [smartChannel, setSmartChannel] = useState<
    "in-app-push" | "telegram" | "discord" | "x"
  >("in-app-push");

  const smartChannelDescription = useMemo(() => {
    if (smartChannel === "in-app-push") return "In-app Push";
    if (smartChannel === "telegram") return "Telegram";
    if (smartChannel === "discord") return "Discord";
    return "X";
  }, [smartChannel]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 md:p-8 lg:p-10">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
          Create campaign
        </h2>
        <p className="text-base text-muted-foreground text-pretty">
          Let&apos;s start by setting up your campaign details
        </p>
      </div>

      <FormField
        control={form.control}
        name="campaignName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Campaign name
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Campaign_Oct_$24.62PM"
                className="h-12 rounded-xl border-border bg-background transition-all duration-300"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="campaignType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">
              Campaign type
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-3"
              >
                {CAMPAIGN_TYPE_OPTIONS.map((item) => (
                  <div
                    key={item.id}
                    className={`relative flex items-start space-x-3 rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 ease-in-out hover:bg-muted/50 ${
                      field.value === item.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-muted-foreground/30"
                    }`}
                    onClick={() => field.onChange(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        field.onChange(item.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <RadioGroupItem
                      value={item.id}
                      id={item.id}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <HugeiconsIcon
                          icon={item.icon}
                          className="h-4 w-4 text-muted-foreground"
                        />
                        <Label
                          htmlFor={item.id}
                          className="font-medium text-foreground cursor-pointer"
                        >
                          {item.title}
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>

            {field.value === "smart-sending" ? (
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="text-sm font-medium text-foreground">
                  Smart campaign channel
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setSmartChannel("in-app-push")}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${
                      smartChannel === "in-app-push"
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <HugeiconsIcon icon={SentIcon} className="h-4 w-4" />
                    In-app Push
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmartChannel("telegram")}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${
                      smartChannel === "telegram"
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <HugeiconsIcon icon={Message01Icon} className="h-4 w-4" />
                    Telegram
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmartChannel("discord")}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${
                      smartChannel === "discord"
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <HugeiconsIcon icon={Message01Icon} className="h-4 w-4" />
                    Discord
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmartChannel("x")}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${
                      smartChannel === "x"
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <HugeiconsIcon icon={Message01Icon} className="h-4 w-4" />X
                  </button>
                </div>
                <FormDescription className="mt-3">
                  Selected channel: {smartChannelDescription}
                </FormDescription>
              </div>
            ) : (
              <FormDescription>
                Choose how you want to deliver this campaign.
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
