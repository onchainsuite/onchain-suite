"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { InputFormField } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { authClient } from "@/lib/auth-client";

import { type OnboardingStepsProps } from "../types";
import {
  type OrganizationSetupFormData,
  organizationSetupSchema,
} from "../validation";

export function OrganizationSetupStep({
  initialData,
  onNext,
}: OnboardingStepsProps) {
  const form = useForm<OrganizationSetupFormData>({
    resolver: zodResolver(organizationSetupSchema),
    defaultValues: {
      organizationName: initialData.organizationName ?? "",
      websiteUrl: initialData.websiteUrl ?? "",
      description: initialData.description ?? "",
    },
  });

  const onSubmit = async (data: OrganizationSetupFormData) => {
    try {
      const slug = data.organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const response = await fetch("/api/v1/organization/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.organizationName,
          slug,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create organization");
      }

      // Refresh session to ensure new org is visible/active if handled by backend
      await authClient.getSession();

      await onNext(data);
    } catch (error: any) {
      console.error("Failed to create organization:", error);
      toast.error(error.message || "Failed to create organization");
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8">
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          Set up your organization
        </h1>
        <p className="text-muted-foreground">
          Tell us a bit about your organization to get started.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <InputFormField
            form={form}
            name="organizationName"
            label="Organization Name"
            placeholder="Acme Corp"
            required
          />

          <InputFormField
            form={form}
            name="websiteUrl"
            label="Website URL"
            placeholder="https://example.com"
          />

          <InputFormField
            form={form}
            name="description"
            label="Description"
            placeholder="Brief description..."
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
