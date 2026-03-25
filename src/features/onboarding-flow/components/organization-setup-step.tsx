"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { InputFormField } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";

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

      console.log("Attempting to create organization...");

      // Ensure session is fresh
      const { data: session } = await authClient.getSession();

      if (!session) {
        throw new Error("No active session found. Please sign in again.");
      }

      // Try creating via authClient (BetterAuth plugin)
      const { data: org, error } = await authClient.organization.create({
        name: data.organizationName,
        slug: slug,
      });

      if (error) {
        console.warn(
          "BetterAuth creation failed, trying custom endpoint as fallback:",
          error.message
        );

        // Fallback to custom endpoint if BetterAuth plugin fails
        const response = await apiClient.post("/organization/create", {
          name: data.organizationName,
          slug,
          websiteUrl: data.websiteUrl,
          description: data.description,
        });

        console.log(
          "Organization created successfully via custom endpoint:",
          response.data
        );
      } else {
        console.log("Organization created successfully via BetterAuth:", org);

        if (org) {
          await authClient.organization.setActive({
            organizationId: org.id,
          });
        }
      }

      // Refresh session one more time to update org state
      await authClient.getSession();

      await onNext(data);
    } catch (error: any) {
      console.error("Failed to create organization (catch block):", error);

      let displayMessage = "Failed to create organization. Please try again.";

      // Handle Axios error structure
      if (error.response?.data) {
        const errorData = error.response.data;
        const rawMessage =
          errorData.message || errorData.error || errorData.details?.message;
        displayMessage =
          typeof rawMessage === "object"
            ? JSON.stringify(rawMessage)
            : String(rawMessage);
      } else if (error.message) {
        displayMessage = error.message;
      }

      toast.error(displayMessage);
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
