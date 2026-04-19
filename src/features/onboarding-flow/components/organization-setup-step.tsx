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

const normalizeWebsiteUrl = (input?: string) => {
  const raw = (input ?? "").trim();
  if (!raw) return undefined;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withScheme).toString();
  } catch {
    return undefined;
  }
};

const findExistingOrganizationId = (
  payload: any,
  expectedName: string,
  expectedSlug: string
): string | null => {
  const root = payload?.data ?? payload;
  const list = Array.isArray(root)
    ? root
    : Array.isArray(root?.data)
      ? root.data
      : Array.isArray(root?.data?.data)
        ? root.data.data
        : [];

  if (!Array.isArray(list)) return null;

  const nameLower = expectedName.toLowerCase().trim();
  const slugLower = expectedSlug.toLowerCase().trim();

  const match = list.find((org: any) => {
    const orgName = String(org?.name ?? "").toLowerCase().trim();
    const orgSlug = String(org?.slug ?? "").toLowerCase().trim();
    return (slugLower && orgSlug === slugLower) || (nameLower && orgName === nameLower);
  });

  const id = match?.id ?? match?.organizationId ?? null;
  return typeof id === "string" && id.length > 0 ? id : null;
};

const generateUniqueSlug = (baseSlug: string) => {
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${baseSlug}-${suffix}`;
};

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

      const websiteUrl = normalizeWebsiteUrl(data.websiteUrl);
      const description = (data.description ?? "").trim();

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

        const createPayload: Record<string, unknown> = {
          name: data.organizationName,
          slug,
          ...(websiteUrl ? { websiteUrl } : {}),
          ...(description ? { description } : {}),
        };

        const createOrganization = async () => {
          const response = await apiClient.post(
            "/organization/create",
            createPayload
          );
          const body = response.data as any;
          const createdOrg = body?.data ?? body?.organization ?? body;
          const organizationId =
            createdOrg?.id ?? createdOrg?.organizationId ?? null;
          if (organizationId) {
            await apiClient.post("/organization/set-active", {
              organizationId,
            });
          }
          return response;
        };

        try {
          const response = await createOrganization();
          console.log(
            "Organization created successfully via custom endpoint:",
            response.data
          );
        } catch (err: any) {
          const messageRaw =
            err?.response?.data?.error?.message ??
            err?.response?.data?.message ??
            err?.response?.data?.error ??
            err?.message ??
            "";
          const message = String(messageRaw);

          if (err?.response?.status === 409) {
            try {
              const listRes = await apiClient.get("/organization/list");
              const existingId = findExistingOrganizationId(
                listRes.data,
                data.organizationName,
                slug
              );
              if (existingId) {
                await apiClient.post("/organization/set-active", {
                  organizationId: existingId,
                });
                await authClient.getSession();
                await onNext(data);
                return;
              }
            } catch {}

            try {
              createPayload.slug = generateUniqueSlug(slug);
              const response = await createOrganization();
              console.log(
                "Organization created successfully via custom endpoint (unique slug):",
                response.data
              );
              await authClient.getSession();
              await onNext(data);
              return;
            } catch (retryErr: any) {
              const retryMsgRaw =
                retryErr?.response?.data?.error?.message ??
                retryErr?.response?.data?.message ??
                retryErr?.response?.data?.error ??
                retryErr?.message ??
                "";
              toast.error(
                String(retryMsgRaw) ||
                  "This organization name is already taken. Please choose a different name."
              );
              return;
            }
          }

          if (
            err?.response?.status === 400 &&
            message.toLowerCase().includes("foreign key")
          ) {
            try {
              const profileName =
                session?.user?.name ??
                session?.user?.email ??
                data.organizationName ??
                "User";
              try {
                await apiClient.get("/user/profile");
              } catch (profileErr: any) {
                const profileMessageRaw =
                  profileErr?.response?.data?.error?.message ??
                  profileErr?.response?.data?.message ??
                  profileErr?.response?.data?.error ??
                  profileErr?.message ??
                  "";
                const profileMessage = String(profileMessageRaw);

                if (
                  profileErr?.response?.status === 404 ||
                  profileMessage.toLowerCase().includes("record not found")
                ) {
                  try {
                    await apiClient.post("/user/profile", {
                      name: profileName,
                    });
                  } catch {
                    await apiClient.put("/user/profile", { name: profileName });
                  }
                } else {
                  throw profileErr;
                }
              }
            } catch (profileBootstrapErr: any) {
              const profileBootstrapMsgRaw =
                profileBootstrapErr?.response?.data?.error?.message ??
                profileBootstrapErr?.response?.data?.message ??
                profileBootstrapErr?.response?.data?.error ??
                profileBootstrapErr?.message ??
                "Failed to create your user profile.";
              toast.error(String(profileBootstrapMsgRaw));
              throw profileBootstrapErr;
            }

            try {
              const response = await createOrganization();
              console.log(
                "Organization created successfully after profile bootstrap:",
                response.data
              );
            } catch (finalErr: any) {
              if (finalErr?.response?.status === 409) {
                try {
                  const listRes = await apiClient.get("/organization/list");
                  const existingId = findExistingOrganizationId(
                    listRes.data,
                    data.organizationName,
                    slug
                  );
                  if (existingId) {
                    await apiClient.post("/organization/set-active", {
                      organizationId: existingId,
                    });
                    await authClient.getSession();
                    await onNext(data);
                    return;
                  }
                } catch {}

                try {
                  createPayload.slug = generateUniqueSlug(slug);
                  const response = await createOrganization();
                  console.log(
                    "Organization created successfully after profile bootstrap (unique slug):",
                    response.data
                  );
                  await authClient.getSession();
                  await onNext(data);
                  return;
                } catch {}
              }

              const finalRaw =
                finalErr?.response?.data?.error?.message ??
                finalErr?.response?.data?.message ??
                finalErr?.response?.data?.error ??
                finalErr?.message ??
                "";
              toast.error(String(finalRaw) || "Failed to create organization.");
              return;
            }
          } else {
            throw err;
          }
        }
      } else {
        console.log("Organization created successfully via BetterAuth:", org);

        const createdOrgId = (org as any)?.id ?? (org as any)?.data?.id ?? null;
        if (createdOrgId) {
          await apiClient.post("/organization/set-active", {
            organizationId: createdOrgId,
          });
        }
      }

      // Refresh session one more time to update org state
      await authClient.getSession();

      await onNext(data);
    } catch (error: any) {
      if (error?.response?.status !== 409) {
        console.error("Failed to create organization (catch block):", error);
      }

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
