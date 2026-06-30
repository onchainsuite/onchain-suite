"use client";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";

import type { CampaignFormData } from "../../validations";
import { SubjectLineInput } from "./subject-line-input";

export interface EmailMessageFormProps {
  form: UseFormReturn<CampaignFormData>;
  verifiedSenderIdentities: Array<{
    id: string;
    email: string;
    name: string;
    isDefault: boolean;
  }>;
  senderIdentitiesLoading: boolean;
}

export function EmailMessageForm({
  form,
  verifiedSenderIdentities,
  senderIdentitiesLoading: _senderIdentitiesLoading,
}: EmailMessageFormProps) {
  const useReplyTo = form.watch("useReplyTo");
  const selectedSenderEmail = form.watch("senderEmail");

  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <EnvelopeIcon
          aria-hidden="true"
          className="h-5 w-5 text-muted-foreground"
        />
        <h3 className="text-xl font-semibold text-foreground">Email message</h3>
      </div>

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

      {/* <div className="flex gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
          Editors, admins, and owners can send for the organization. If this
          sender email matches a verified sender identity, the backend uses it;
          otherwise it falls back to the org default sender, another verified
          sender, or the platform sender.
        </p>
      </div> */}

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
                placeholder="support@company.com"
                className="h-10 rounded-xl border-border bg-background transition-all duration-300"
              />
            </FormControl>
            {/* <FormDescription>
              {senderIdentitiesLoading
                ? "Loading verified sender identities for this organization."
                : verifiedSenderIdentities.length > 0
                  ? "Matching a verified sender identity uses that address directly; otherwise the backend falls back to the organization sender."
                  : "No verified sender identities found yet, so the backend will fall back to the platform sender until your organization adds one."}
            </FormDescription>
            {selectedSenderEmail.trim().length > 0 ? (
              <div className="text-xs text-muted-foreground">
                {selectedVerifiedSender
                  ? `This matches verified sender ${selectedVerifiedSender.email}.`
                  : "This does not match a verified sender identity, so backend fallback rules will be used when sending."}
              </div>
            ) : null} */}
            <FormMessage />
          </FormItem>
        )}
      />

      {verifiedSenderIdentities.length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Verified sender suggestions
          </div>
          <div className="flex flex-wrap gap-2">
            {verifiedSenderIdentities.map((identity) => (
              <Button
                key={identity.id}
                type="button"
                variant={
                  selectedSenderEmail === identity.email ? "default" : "outline"
                }
                className="h-8 rounded-full px-3 text-xs"
                onClick={() => {
                  form.setValue("senderEmail", identity.email, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                  const currentSenderName = form.getValues("senderName").trim();
                  if (
                    currentSenderName.length === 0 ||
                    currentSenderName === "Pivotup Media"
                  ) {
                    form.setValue("senderName", identity.name, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }
                }}
              >
                {identity.email}
                {identity.isDefault ? " (Default)" : ""}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

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
