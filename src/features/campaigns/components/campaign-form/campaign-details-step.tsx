"use client";

import { Mail, TrendingUp, Users } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

import type { CampaignFormData } from "../../validations";

interface CampaignDetailsStepProps {
  form: UseFormReturn<CampaignFormData>;
}

const TEMPLATE_OPTIONS = [
  {
    id: "email-blast",
    title: "Email Blast",
    description: "Send one-off campaigns or manage a batch of emails",
    icon: Mail,
  },
  {
    id: "drip-campaign",
    title: "Drip campaign",
    description: "Send messages at specific intervals in a specific audience",
    icon: TrendingUp,
  },
  {
    id: "smart-sending",
    title: "Smart sending",
    description: "Send messages at specific intervals in a specific audience",
    icon: Users,
  },
];

export function CampaignDetailsStep({ form }: CampaignDetailsStepProps) {
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
          <FormItem>
            <FormLabel className="text-base font-medium">
              Campaign type
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 rounded-xl border-border bg-background transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="rounded-xl border-border bg-card">
                <SelectItem value="email-blast" className="rounded-lg">
                  Email Blast
                </SelectItem>
                <SelectItem value="drip-campaign" className="rounded-lg">
                  Drip Campaign
                </SelectItem>
                <SelectItem value="newsletter" className="rounded-lg">
                  Newsletter
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Send one-off campaigns or manage a batch of emails
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="template"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium">
              Select a template
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-3"
              >
                {TEMPLATE_OPTIONS.map((item) => (
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
                        <item.icon className="h-4 w-4 text-muted-foreground" />
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
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
