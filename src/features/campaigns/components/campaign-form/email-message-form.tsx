"use client";

import type { UseFormReturn } from "react-hook-form";
import { Mail, AlertCircle } from "lucide-react";
import { Input } from "@/ui/input";
import { Checkbox } from "@/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/ui/form";
import type { CampaignFormData } from "../../validations";
import { SubjectLineInput } from "./subject-line-input";

interface EmailMessageFormProps {
  form: UseFormReturn<CampaignFormData>;
}

export function EmailMessageForm({ form }: EmailMessageFormProps) {
  const useReplyTo = form.watch("useReplyTo");

  return (
    <div className="p-6 md:p-8 bg-muted/20 space-y-6 lg:max-h-[800px] lg:overflow-y-auto">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <Mail className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-foreground">Email message</h3>
      </div>

      {/* Subject Line */}
      <FormField
        control={form.control}
        name="emailSubject"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium flex items-center gap-1">
              Subject line
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <SubjectLineInput value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Preview Text */}
      <FormField
        control={form.control}
        name="previewText"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Preview text</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="h-10 rounded-xl border-border bg-background transition-all duration-300"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Sender Name */}
      <FormField
        control={form.control}
        name="senderName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium flex items-center gap-1">
              Sender name
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                className="h-10 rounded-xl border-border bg-background transition-all duration-300"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Info Alert */}
      <div className="flex gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
          Sending from a personal email address (e.g. gmail.com) can cause inbox
          providers to flag your messages as spam.{" "}
          <span className="font-medium underline cursor-pointer">
            Update your default sender email address to improve deliverability.
          </span>
        </p>
      </div>

      {/* Sender Email */}
      <FormField
        control={form.control}
        name="senderEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium flex items-center gap-1">
              Sender email
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                className="h-10 rounded-xl border-border bg-background transition-all duration-300"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Reply-to Section */}
      <div className="space-y-3">
        <FormField
          control={form.control}
          name="useReplyTo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="rounded data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </FormControl>
              <FormLabel className="text-sm font-medium cursor-pointer">
                Use as reply-to
              </FormLabel>
            </FormItem>
          )}
        />

        {!useReplyTo && (
          <FormField
            control={form.control}
            name="replyToEmail"
            render={({ field }) => (
              <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                <FormLabel className="text-sm font-medium flex items-center gap-1">
                  Reply-to email address
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="reply@example.com"
                    className="h-10 rounded-xl border-border bg-background transition-all duration-300"
                  />
                </FormControl>
                <FormDescription>
                  Replies to this email will be sent to this address instead of
                  the sender email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}
