"use client";

import type { UseFormReturn } from "react-hook-form";
import { Users, TrendingUp, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import type { CampaignFormData } from "../../validations";
import { AudienceSelector } from "./audience-selector";
import { CAMPAIGN_LISTS, CAMPAIGN_SEGMENTS } from "../../../campaigns/constants";

interface AudienceStepProps {
  form: UseFormReturn<CampaignFormData>;
}

export function AudienceStep({ form }: AudienceStepProps) {
  const selectedAudiences = form.watch("selectedAudiences");

  const estimatedRecipients = selectedAudiences.reduce((total, id) => {
    const list = CAMPAIGN_LISTS.find((l) => l.id === id);
    const segment = CAMPAIGN_SEGMENTS.find((s) => s.id === id);
    return total + (list?.count || segment?.count || 0);
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 md:p-8 lg:p-10">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
          Audience & Tracking
        </h2>
        <p className="text-base text-muted-foreground text-pretty">
          Define who will receive your campaign and tracking settings
        </p>
      </div>

      {/* Audience Section */}
      <div className="space-y-6 p-6 bg-muted/30 rounded-2xl border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-foreground" />
            <h3 className="text-xl font-semibold text-foreground">Audience</h3>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-border bg-background">
              <span className="text-sm font-semibold">
                {estimatedRecipients}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">Estimated recipients</span>
              <Info className="h-4 w-4" />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="selectedAudiences"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Send to</FormLabel>
              <FormControl>
                <AudienceSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Links in this campaign will include audience tracking
                information, called UTM parameters. This allows bounce tracking
                within third-party analytics tools such as Google Analytics.{" "}
                <span className="text-primary hover:underline cursor-pointer">
                  Learn more about UTM
                </span>
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Don't Send To Section */}
      <div className="space-y-4 p-6 bg-muted/30 rounded-2xl border border-border">
        <Label className="text-base font-medium text-foreground">
          Don't send to
        </Label>
        <FormField
          control={form.control}
          name="smartSending"
          render={({ field }) => (
            <FormItem className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Run on Smart Sending
                  </FormLabel>
                </div>
                <FormDescription>
                  This campaign will not be sent to profiles who received a
                  message from you in the last{" "}
                  <span className="font-medium text-foreground">10 hours</span>.
                  Smart Sending (thresholds) can be updated in{" "}
                  <span className="text-primary hover:underline cursor-pointer">
                    account settings
                  </span>
                  .
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Tracking Section */}
      <div className="space-y-4 p-6 bg-muted/30 rounded-2xl border border-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-foreground" />
          <h3 className="text-xl font-semibold text-foreground">Tracking</h3>
        </div>

        <FormField
          control={form.control}
          name="trackingParameters"
          render={({ field }) => (
            <FormItem className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Include tracking parameters
                  </FormLabel>
                </div>
                <FormDescription>
                  Links in this campaign will include audience tracking
                  information, called UTM parameters. This allows bounce
                  tracking within third-party analytics tools such as Google
                  Analytics.{" "}
                  <span className="text-primary hover:underline cursor-pointer">
                    Learn more about UTM
                  </span>
                  .
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
