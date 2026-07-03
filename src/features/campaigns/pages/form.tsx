"use client";

import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ClockIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/ui/button";
import { Form } from "@/ui/form";

import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import {
  getZonedDateTimeParts,
  parseTimeOfDay,
  zonedWallTimeToUtcDate,
} from "@/lib/timezone";
import {
  extractEmailContent,
  getSelectedOrganizationId,
  isJsonObject,
} from "@/lib/utils";

import {
  type CampaignFormData,
  campaignFormSchema,
} from "../../campaigns/validations";
import { audienceService } from "@/features/audience/audience.service";
import { campaignsService } from "@/features/campaigns/campaigns.service";
import { AudienceStep } from "@/features/campaigns/components/campaign-form/audience-step";
import { ConfirmationPage } from "@/features/campaigns/components/campaign-form/campaign-confirmation";
import { CampaignDetailsStep } from "@/features/campaigns/components/campaign-form/campaign-details-step";
import { ScheduleStep } from "@/features/campaigns/components/campaign-form/schedule-step";
import { TemplateStep } from "@/features/campaigns/components/campaign-form/template-step";
import { partitionAudienceSelection } from "@/features/campaigns/lib/audience";
import type { List, Segment } from "@/features/campaigns/types";
import {
  type IntelligenceSegment,
  intelligenceService,
} from "@/features/intelligence/intelligence.service";
import { PRIVATE_ROUTES } from "@/shared/config/app-routes";
import { useActiveTimezone } from "@/shared/hooks/client/use-timezones";

const TOTAL_STEPS = 5;
const campaignTypes = new Set<CampaignFormData["campaignType"]>([
  "email-blast",
  "drip-campaign",
  "smart-sending",
  "newsletter",
  "promotional",
  "announcement",
  "automation",
]);
const sendOptions = new Set<CampaignFormData["sendOption"]>([
  "now",
  "schedule",
]);

interface SenderIdentityOption {
  id: string;
  email: string;
  name: string;
  isDefault: boolean;
  status: "verified" | "pending" | "failed";
}

interface OrganizationMemberPermissions {
  canManageMembers: boolean;
  canManageSenderIdentities: boolean;
  canEditCampaigns: boolean;
  canSendEmail: boolean;
  canLaunchCampaigns: boolean;
  canViewSettings: boolean;
}

interface CurrentMemberAccess {
  id: string;
  email: string;
  roleLabel: string;
  isEnabled: boolean;
  permissions?: OrganizationMemberPermissions;
}

const unwrapData = (payload: unknown): unknown => {
  if (isJsonObject(payload) && "data" in payload) {
    return payload.data ?? payload;
  }
  return payload;
};

const toArray = (payload: unknown): unknown[] => {
  const root = unwrapData(payload);
  if (Array.isArray(root)) return root;
  if (isJsonObject(root) && Array.isArray(root.items)) return root.items;
  if (isJsonObject(root) && Array.isArray(root.data)) return root.data;
  return [];
};

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
};

const pickBooleanLike = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") {
      if (value === 1) return true;
      if (value === 0) return false;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (
        [
          "true",
          "1",
          "yes",
          "enabled",
          "active",
          "verified",
          "default",
        ].includes(normalized)
      ) {
        return true;
      }
      if (
        [
          "false",
          "0",
          "no",
          "disabled",
          "inactive",
          "pending",
          "failed",
        ].includes(normalized)
      ) {
        return false;
      }
    }
  }
  return undefined;
};

const toCampaignSegment = (value: unknown): Segment | null => {
  if (!isJsonObject(value)) return null;
  const id = pickString(value.id);
  const name = pickString(value.name, value.title, value.label);
  if (!id || !name) return null;

  return {
    id,
    name,
    count:
      typeof value.count === "number"
        ? value.count
        : typeof value.totalProfiles === "number"
          ? value.totalProfiles
          : 0,
    starred: Boolean(value.starred ?? value.isStarred ?? false),
  };
};

const toCampaignList = (value: unknown): List | null => {
  if (!isJsonObject(value)) return null;
  const id = pickString(value.id);
  if (!id) return null;

  const name =
    pickString(
      value.name,
      value.fullName,
      value.email,
      value.wallet,
      value.walletAddress
    ) ?? id;

  return {
    id,
    name,
    count: 1,
    starred: false,
  };
};

const normalizeIntelligenceSegments = (
  payload: unknown
): IntelligenceSegment[] => {
  const root = unwrapData(payload);
  if (Array.isArray(root)) return root as IntelligenceSegment[];
  if (isJsonObject(root) && Array.isArray(root.items)) {
    return root.items as IntelligenceSegment[];
  }
  if (isJsonObject(root) && Array.isArray(root.data)) {
    return root.data as IntelligenceSegment[];
  }
  return [];
};

const resolveSenderStatus = (
  ...values: unknown[]
): SenderIdentityOption["status"] => {
  for (const value of values) {
    if (typeof value !== "string") continue;
    const normalized = value.trim().toLowerCase();
    if (normalized.includes("ver")) return "verified";
    if (normalized.includes("pend")) return "pending";
    if (normalized.includes("fail")) return "failed";
  }
  return "pending";
};

const normalizeSenderIdentities = (
  payload: unknown
): SenderIdentityOption[] => {
  return toArray(payload)
    .map((entry, index) => {
      if (!isJsonObject(entry)) return null;
      const email = pickString(
        entry.email,
        entry.senderEmail,
        entry.address,
        entry.fromEmail
      );
      if (!email) return null;
      return {
        id:
          pickString(entry.id, entry.senderId, entry.identityId) ??
          `${email}-${index}`,
        email,
        name:
          pickString(entry.name, entry.senderName, entry.displayName) ??
          email.split("@")[0] ??
          "Sender",
        isDefault:
          pickBooleanLike(entry.isDefault, entry.default, entry.isPrimary) ??
          false,
        status: resolveSenderStatus(
          entry.status,
          entry.verificationStatus,
          entry.state,
          pickBooleanLike(entry.verified, entry.isVerified)
            ? "verified"
            : "pending"
        ),
      } satisfies SenderIdentityOption;
    })
    .filter((entry): entry is SenderIdentityOption => Boolean(entry))
    .sort((left, right) => {
      if (left.isDefault !== right.isDefault) {
        return left.isDefault ? -1 : 1;
      }
      return left.email.localeCompare(right.email);
    });
};

const normalizeMemberPermissions = (
  payload: unknown
): OrganizationMemberPermissions | undefined => {
  if (!isJsonObject(payload)) return undefined;
  return {
    canManageMembers: pickBooleanLike(payload.canManageMembers) ?? false,
    canManageSenderIdentities:
      pickBooleanLike(payload.canManageSenderIdentities) ?? false,
    canEditCampaigns: pickBooleanLike(payload.canEditCampaigns) ?? false,
    canSendEmail: pickBooleanLike(payload.canSendEmail) ?? false,
    canLaunchCampaigns: pickBooleanLike(payload.canLaunchCampaigns) ?? false,
    canViewSettings: pickBooleanLike(payload.canViewSettings) ?? false,
  };
};

const normalizeCurrentMemberAccess = (
  payload: unknown,
  sessionUser: { email?: string | null; id?: string | null } | undefined
): CurrentMemberAccess | null => {
  const sessionEmail = sessionUser?.email?.trim().toLowerCase();
  const sessionUserId = sessionUser?.id?.trim();

  if (!sessionEmail && !sessionUserId) return null;

  for (const entry of toArray(payload)) {
    if (!isJsonObject(entry)) continue;
    const email = pickString(entry.email, entry.userEmail)?.toLowerCase();
    const id = pickString(entry.userId, entry.id);
    const matchesEmail = Boolean(sessionEmail && email === sessionEmail);
    const matchesId = Boolean(sessionUserId && id === sessionUserId);
    if (!matchesEmail && !matchesId) continue;

    return {
      id: id ?? email ?? "current-member",
      email: email ?? sessionEmail ?? "",
      roleLabel:
        pickString(entry.roleLabel, entry.role, entry.roleName) ?? "Viewer",
      isEnabled:
        pickBooleanLike(entry.isEnabled, entry.enabled, entry.active) ?? true,
      permissions: normalizeMemberPermissions(entry.permissions),
    };
  }

  return null;
};

const asCampaignType = (
  value: unknown
): CampaignFormData["campaignType"] | undefined => {
  if (typeof value !== "string") return undefined;
  return campaignTypes.has(value as CampaignFormData["campaignType"])
    ? (value as CampaignFormData["campaignType"])
    : undefined;
};

const asSendOption = (
  value: unknown
): CampaignFormData["sendOption"] | undefined => {
  if (typeof value !== "string") return undefined;
  return sendOptions.has(value as CampaignFormData["sendOption"])
    ? (value as CampaignFormData["sendOption"])
    : undefined;
};

function CampaignPreviewStep({
  form,
  campaignId,
}: {
  form: UseFormReturn<CampaignFormData>;
  campaignId?: string;
}) {
  const [tab, setTab] = useState<"html" | "text">("html");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewText, setPreviewText] = useState("");

  const normalizedCampaignId = useMemo(() => {
    return campaignId && campaignId.trim().length > 0 ? campaignId.trim() : "";
  }, [campaignId]);

  const getRenderRequest = () => {
    const values = form.getValues();
    const subject = values.emailSubject?.trim();
    const previewText = values.previewText?.trim();
    const senderName = values.senderName?.trim();
    const senderEmail = values.senderEmail?.trim();
    const replyToEmail = values.replyToEmail?.trim();

    return {
      subject: subject && subject.length > 0 ? subject : undefined,
      previewText:
        previewText && previewText.length > 0 ? previewText : undefined,
      senderName: senderName && senderName.length > 0 ? senderName : undefined,
      senderEmail:
        senderEmail && senderEmail.length > 0 ? senderEmail : undefined,
      replyToEmail:
        values.useReplyTo && replyToEmail && replyToEmail.length > 0
          ? replyToEmail
          : undefined,
    };
  };

  const getCanonicalPreview = async () => {
    if (!normalizedCampaignId) throw new Error("Missing campaign id.");
    const preview = await campaignsService.preview(
      normalizedCampaignId,
      getRenderRequest()
    );
    const extracted = extractEmailContent(preview);
    if (
      (extracted.html?.trim().length ?? 0) > 0 ||
      (extracted.textVersion?.trim().length ?? 0) > 0
    ) {
      return {
        html: extracted.html ?? "",
        text: extracted.textVersion ?? "",
      };
    }

    try {
      const email =
        await campaignsService.getEmailContent(normalizedCampaignId);
      const extracted = extractEmailContent(email);
      if (
        (extracted.html?.trim().length ?? 0) > 0 ||
        (extracted.textVersion?.trim().length ?? 0) > 0
      ) {
        return {
          html: extracted.html ?? "",
          text: extracted.textVersion ?? "",
        };
      }
    } catch (_e) {
      String(_e);
    }
    throw new Error(
      "This campaign has no rendered email content yet. Save or regenerate the email before launch."
    );
  };

  const previewMutation = useMutation({
    mutationFn: getCanonicalPreview,
    onSuccess: (data) => {
      setPreviewHtml(typeof data.html === "string" ? data.html : "");
      setPreviewText(typeof data.text === "string" ? data.text : "");
      setTab("html");
    },
    onError: (e: unknown) => {
      const message =
        e instanceof Error ? e.message : "Failed to generate preview";
      toast.error(message);
    },
  });

  const values = form.watch();
  const isScheduled = values.sendOption === "schedule";
  const timezone =
    typeof values.timezone === "string" && values.timezone.length > 0
      ? values.timezone
      : "UTC";

  const scheduleLabel = useMemo(() => {
    if (!isScheduled) return "Send now";
    if (!values.scheduleDate || !values.scheduleTime) return "Schedule (—)";
    const { hour, minute } = parseTimeOfDay(values.scheduleTime);
    const utc = zonedWallTimeToUtcDate(
      {
        year: values.scheduleDate.getFullYear(),
        month: values.scheduleDate.getMonth() + 1,
        day: values.scheduleDate.getDate(),
        hour,
        minute,
      },
      timezone
    );
    const dt = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(utc);
    return `Schedule (${dt} ${timezone})`;
  }, [isScheduled, timezone, values.scheduleDate, values.scheduleTime]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 md:p-8 lg:p-10">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
          Preview campaign
        </h2>
        <p className="text-base text-muted-foreground text-pretty">
          Review your details and preview the email before sending.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground">Summary</div>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="text-foreground">Campaign:</span>{" "}
              {values.campaignName || "Untitled"}
            </div>
            <div>
              <span className="text-foreground">Type:</span>{" "}
              {values.campaignType}
            </div>
            <div>
              <span className="text-foreground">Subject:</span>{" "}
              {values.emailSubject || "—"}
            </div>
            <div>
              <span className="text-foreground">From:</span>{" "}
              {values.senderName ? `${values.senderName} ` : ""}
              {values.senderEmail || "—"}
            </div>
            <div>
              <span className="text-foreground">Send:</span> {scheduleLabel}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground">Template</div>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="text-foreground">Selected template:</span>{" "}
              {values.selectedTemplate && values.selectedTemplate.length > 0
                ? values.selectedTemplate
                : "—"}
            </div>
            <div>
              <span className="text-foreground">Campaign id:</span>{" "}
              {normalizedCampaignId || "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-medium text-foreground">
            Email preview
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={tab === "html" ? "default" : "outline"}
              className="rounded-xl"
              onClick={() => setTab("html")}
            >
              HTML
            </Button>
            <Button
              type="button"
              variant={tab === "text" ? "default" : "outline"}
              className="rounded-xl"
              onClick={() => setTab("text")}
            >
              Plain text
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={!normalizedCampaignId || previewMutation.isPending}
              onClick={() => previewMutation.mutate()}
            >
              {previewMutation.isPending ? (
                <ArrowPathIcon
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin"
                />
              ) : (
                "Generate preview"
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {tab === "html" ? (
            <div className="h-[65vh] overflow-hidden rounded-xl border border-border">
              {previewHtml.trim().length > 0 ? (
                <iframe
                  title="Email HTML preview"
                  srcDoc={previewHtml}
                  className="h-full w-full bg-white"
                  style={{ border: "none" }}
                />
              ) : previewMutation.isPending ? (
                <div className="flex h-full items-center justify-center gap-2 bg-card text-sm text-muted-foreground">
                  <ArrowPathIcon
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin"
                  />
                  Generating preview…
                </div>
              ) : (
                <div className="flex h-full items-center justify-center bg-card p-6 text-center">
                  <div className="max-w-md space-y-2">
                    <div className="text-sm font-medium text-foreground">
                      No preview yet
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Select a template (or save content in the editor), then
                      click Generate preview.
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <pre className="h-[65vh] overflow-auto rounded-xl border border-border bg-muted p-4 text-sm text-foreground whitespace-pre-wrap">
              {previewText.length > 0
                ? previewText
                : "No text preview available."}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export function CreateCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { timezone: activeTimezone } = useActiveTimezone();
  const { data: session } = authClient.useSession();
  const safeSearchParams = useMemo(
    () => searchParams ?? new URLSearchParams(),
    [searchParams]
  );
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const initialStep = useMemo(() => {
    const raw = Number(safeSearchParams.get("step") ?? "1");
    if (!Number.isFinite(raw)) return 1;
    return Math.min(TOTAL_STEPS, Math.max(1, Math.trunc(raw)));
  }, [safeSearchParams]);

  const initialCampaignFromUrl = useMemo(() => {
    const raw = safeSearchParams.get("campaign");
    return raw && raw.trim().length > 0 ? raw.trim() : undefined;
  }, [safeSearchParams]);

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [campaignId, setCampaignId] = useState<string | undefined>(
    initialCampaignFromUrl
  );
  const [isBootstrappingCampaign, setIsBootstrappingCampaign] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const [isHydratingCampaign, setIsHydratingCampaign] = useState(false);
  const [hasHydratedCampaign, setHasHydratedCampaign] = useState(false);

  const campaignIdRef = useRef<string | undefined>(campaignId);
  const currentStepRef = useRef<number>(currentStep);
  const isHydratingRef = useRef<boolean>(isHydratingCampaign);
  const isBootstrappingRef = useRef<boolean>(isBootstrappingCampaign);
  const isBootstrappingInFlightRef = useRef<boolean>(false);
  const lastAutosavePayloadRef = useRef<string>("");

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      campaignName: "",
      campaignType: "email-blast",
      selectedAudiences: [],
      smartSending: true,
      trackingParameters: true,
      utmSource: "onchain_suite",
      utmMedium: "email",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
      selectedTemplate: "",
      emailSubject: "",
      previewText: "",
      senderName: "Pivotup Media",
      senderEmail: "",
      useReplyTo: true,
      replyToEmail: "",
      sendOption: "now",
      scheduleTime: "09:00",
      timezone: "UTC",
    },
  });

  useEffect(() => {
    const syncSelectedOrgId = () => {
      setSelectedOrgId(getSelectedOrganizationId());
    };

    syncSelectedOrgId();
    window.addEventListener("onchain:org-changed", syncSelectedOrgId);
    return () =>
      window.removeEventListener("onchain:org-changed", syncSelectedOrgId);
  }, []);

  const organizationId = useMemo(() => {
    const selected = selectedOrgId?.trim();
    if (selected) return selected;
    const active = session?.session?.activeOrganizationId;
    return typeof active === "string" && active.trim().length > 0
      ? active.trim()
      : null;
  }, [selectedOrgId, session?.session?.activeOrganizationId]);

  const orgHeaders = useMemo(
    () =>
      organizationId
        ? {
            "x-org-id": organizationId,
            "x-onchain-silent-error": "1",
          }
        : undefined,
    [organizationId]
  );

  const senderIdentitiesQuery = useQuery({
    queryKey: ["campaigns", "sender-identities", organizationId],
    enabled: Boolean(organizationId && orgHeaders),
    retry: false,
    queryFn: async () => {
      const response = await apiClient.get("/sender-identities", {
        headers: orgHeaders,
      });
      return normalizeSenderIdentities(response.data);
    },
  });

  const currentMemberAccessQuery = useQuery({
    queryKey: ["campaigns", "member-access", organizationId, session?.user?.id],
    enabled: Boolean(organizationId && orgHeaders),
    retry: false,
    queryFn: async () => {
      const response = await apiClient.get(
        `/organizations/${organizationId}/members`,
        {
          headers: orgHeaders,
        }
      );
      return normalizeCurrentMemberAccess(response.data, {
        email: session?.user?.email ?? null,
        id:
          typeof session?.user?.id === "string"
            ? session.user.id
            : typeof session?.session?.userId === "string"
              ? session.session.userId
              : null,
      });
    },
  });

  const audienceSegmentsQuery = useQuery({
    queryKey: ["intelligence", "segments", "campaign-form"],
    queryFn: async () => {
      const response = await intelligenceService.listSegments({ limit: 100 });
      const items = normalizeIntelligenceSegments(response);
      return items
        .map(toCampaignSegment)
        .filter((item): item is Segment => !!item);
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  const audienceUsersQuery = useQuery({
    queryKey: ["audience", "profiles", "campaign-form"],
    queryFn: async () => {
      const response = await audienceService.listProfiles({
        page: 1,
        limit: 100,
        include: "wallets,tags,health,lastAction",
      });
      const items = toArray(response);
      return items.map(toCampaignList).filter((item): item is List => !!item);
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  const verifiedSenderIdentities = useMemo(
    () =>
      (senderIdentitiesQuery.data ?? []).filter(
        (identity) => identity.status === "verified"
      ),
    [senderIdentitiesQuery.data]
  );

  const currentMemberAccess = currentMemberAccessQuery.data;
  const canSendEmail =
    currentMemberAccess?.isEnabled === false
      ? false
      : currentMemberAccess?.permissions?.canSendEmail !== false;
  const canLaunchCampaigns =
    currentMemberAccess?.isEnabled === false
      ? false
      : currentMemberAccess?.permissions?.canLaunchCampaigns !== false;

  useEffect(() => {
    const currentSenderEmail = form.getValues("senderEmail").trim();
    if (currentSenderEmail.length > 0) return;
    if (verifiedSenderIdentities.length === 0) return;

    const preferredSender =
      verifiedSenderIdentities.find((identity) => identity.isDefault) ??
      verifiedSenderIdentities[0];
    if (!preferredSender) return;

    form.setValue("senderEmail", preferredSender.email, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: true,
    });

    const currentSenderName = form.getValues("senderName").trim();
    if (
      currentSenderName.length === 0 ||
      currentSenderName === "Pivotup Media"
    ) {
      form.setValue("senderName", preferredSender.name, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: true,
      });
    }
  }, [form, verifiedSenderIdentities]);

  useEffect(() => {
    const current = form.getValues("timezone");
    if (current === activeTimezone) return;
    form.setValue("timezone", activeTimezone, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [activeTimezone, form]);

  const computeScheduleUtcIso = useCallback(
    (data: CampaignFormData): string | undefined => {
      if (data.sendOption !== "schedule") return undefined;
      if (!(data.scheduleDate instanceof Date)) return undefined;
      if (
        typeof data.scheduleTime !== "string" ||
        data.scheduleTime.length === 0
      )
        return undefined;
      const tz =
        typeof data.timezone === "string" && data.timezone.trim().length > 0
          ? data.timezone.trim()
          : activeTimezone;
      const { hour, minute } = parseTimeOfDay(data.scheduleTime);
      const utc = zonedWallTimeToUtcDate(
        {
          year: data.scheduleDate.getFullYear(),
          month: data.scheduleDate.getMonth() + 1,
          day: data.scheduleDate.getDate(),
          hour,
          minute,
        },
        tz
      );
      return utc.toISOString();
    },
    [activeTimezone]
  );

  useEffect(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  useEffect(() => {
    campaignIdRef.current = campaignId;
  }, [campaignId]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    isHydratingRef.current = isHydratingCampaign;
  }, [isHydratingCampaign]);

  useEffect(() => {
    isBootstrappingRef.current = isBootstrappingCampaign;
  }, [isBootstrappingCampaign]);

  useEffect(() => {
    const ensureCampaign = async () => {
      if (campaignIdRef.current) return;
      if (isBootstrappingInFlightRef.current) return;
      if (bootstrapError) return;

      isBootstrappingInFlightRef.current = true;
      setIsBootstrappingCampaign(true);
      setBootstrapError(null);
      try {
        const created = await campaignsService.createCampaign({
          name: "Untitled campaign",
          type: form.getValues("campaignType"),
          status: "draft",
        });
        if (!created?.id) throw new Error("Failed to create campaign draft");
        setCampaignId(created.id);

        const next = new URLSearchParams(safeSearchParams.toString());
        next.set("campaign", created.id);
        next.set("step", String(currentStepRef.current));
        router.replace(`/campaigns/new?${next.toString()}`);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to create campaign";
        setBootstrapError(message);
        toast.error(message);
      } finally {
        setIsBootstrappingCampaign(false);
        isBootstrappingInFlightRef.current = false;
      }
    };

    ensureCampaign().catch(() => undefined);
  }, [bootstrapError, form, router, safeSearchParams]);

  useEffect(() => {
    const hydrate = async () => {
      if (!campaignId) return;
      if (hasHydratedCampaign) return;

      if (!initialCampaignFromUrl) {
        setHasHydratedCampaign(true);
        return;
      }

      setIsHydratingCampaign(true);
      try {
        const [campaignRes, contentRes, audienceRes, trackingRes, scheduleRes] =
          await Promise.allSettled([
            campaignsService.getCampaign(campaignId),
            campaignsService.getContent(campaignId),
            campaignsService.getAudience(campaignId),
            campaignsService.getTracking(campaignId),
            campaignsService.getSchedule(campaignId),
          ]);

        const nextValues: Partial<CampaignFormData> = {};

        if (campaignRes.status === "fulfilled") {
          const cObj: Record<string, unknown> = isJsonObject(campaignRes.value)
            ? campaignRes.value
            : {};
          const { name: campaignName, type, templateId } = cObj;
          if (typeof campaignName === "string" && campaignName.length > 0) {
            nextValues.campaignName = campaignName;
          }
          const campaignType = asCampaignType(type);
          if (campaignType) nextValues.campaignType = campaignType;
          if (typeof templateId === "string") {
            nextValues.selectedTemplate = templateId;
          }
        }

        if (contentRes.status === "fulfilled") {
          const cObj: Record<string, unknown> = isJsonObject(contentRes.value)
            ? contentRes.value
            : {};
          const {
            subject,
            previewText,
            senderName,
            senderEmail,
            replyToEmail,
          } = cObj;
          if (typeof subject === "string" || subject === null) {
            nextValues.emailSubject = String(subject ?? "");
          }
          if (typeof previewText === "string" || previewText === null) {
            nextValues.previewText = String(previewText ?? "");
          }
          if (typeof senderName === "string" || senderName === null) {
            nextValues.senderName = String(senderName ?? "");
          }
          if (typeof senderEmail === "string" || senderEmail === null) {
            nextValues.senderEmail = String(senderEmail ?? "");
          }
          if ("replyToEmail" in cObj) {
            const reply = typeof replyToEmail === "string" ? replyToEmail : "";
            nextValues.replyToEmail = reply;
            nextValues.useReplyTo = reply.length > 0;
          }
        }

        if (audienceRes.status === "fulfilled") {
          const aObj: Record<string, unknown> = isJsonObject(audienceRes.value)
            ? audienceRes.value
            : {};
          const { listIds: listIdsRaw, segmentIds: segmentIdsRaw } = aObj;
          const listIds = Array.isArray(listIdsRaw)
            ? listIdsRaw.map(String)
            : [];
          const segmentIds = Array.isArray(segmentIdsRaw)
            ? segmentIdsRaw.map(String)
            : [];
          if (listIds.length || segmentIds.length) {
            nextValues.selectedAudiences = [...listIds, ...segmentIds];
          }
        }

        if (trackingRes.status === "fulfilled") {
          const tObj: Record<string, unknown> = isJsonObject(trackingRes.value)
            ? trackingRes.value
            : {};
          const { smartSending, trackingParameters, utm } = tObj;
          if (typeof smartSending === "boolean") {
            nextValues.smartSending = smartSending;
          }
          if (typeof trackingParameters === "boolean") {
            nextValues.trackingParameters = trackingParameters;
          }
          if (isJsonObject(utm)) {
            const utmStr = (value: unknown) =>
              typeof value === "string" ? value : undefined;
            const source = utmStr(utm.source);
            const medium = utmStr(utm.medium);
            const campaign = utmStr(utm.campaign);
            const term = utmStr(utm.term);
            const content = utmStr(utm.content);
            if (source !== undefined) nextValues.utmSource = source;
            if (medium !== undefined) nextValues.utmMedium = medium;
            if (campaign !== undefined) nextValues.utmCampaign = campaign;
            if (term !== undefined) nextValues.utmTerm = term;
            if (content !== undefined) nextValues.utmContent = content;
          }
        }

        if (scheduleRes.status === "fulfilled") {
          const sObj: Record<string, unknown> = isJsonObject(scheduleRes.value)
            ? scheduleRes.value
            : {};
          const { sendOption: sendOptionRaw, scheduleDate } = sObj;
          const sendOption = asSendOption(sendOptionRaw);
          if (sendOption) nextValues.sendOption = sendOption;
          if (typeof scheduleDate === "string") {
            const parsed = new Date(scheduleDate);
            if (!Number.isNaN(parsed.getTime())) {
              const tz = activeTimezone;
              const parts = getZonedDateTimeParts(parsed, tz);
              nextValues.timezone = tz;
              nextValues.scheduleDate = new Date(
                parts.year,
                parts.month - 1,
                parts.day
              );
              nextValues.scheduleTime = `${String(parts.hour).padStart(
                2,
                "0"
              )}:${String(parts.minute).padStart(2, "0")}`;
            }
          }
        }

        if (Object.keys(nextValues).length > 0) {
          form.reset({ ...form.getValues(), ...nextValues });
        }
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load campaign";
        toast.error(message);
      } finally {
        setHasHydratedCampaign(true);
        setIsHydratingCampaign(false);
      }
    };

    hydrate().catch(() => undefined);
  }, [
    activeTimezone,
    campaignId,
    form,
    hasHydratedCampaign,
    initialCampaignFromUrl,
  ]);

  useEffect(() => {
    if (!campaignId) return;

    const interval = setInterval(() => {
      const id = campaignIdRef.current;
      if (!id) return;
      if (isHydratingRef.current) return;
      if (isBootstrappingRef.current) return;

      const values = form.getValues();
      const scheduleDateIso = computeScheduleUtcIso(values);

      const payload = {
        step: currentStepRef.current,
        ...values,
        scheduleDate: scheduleDateIso,
      };

      const serialized = JSON.stringify(payload);
      if (serialized === lastAutosavePayloadRef.current) return;
      lastAutosavePayloadRef.current = serialized;

      campaignsService.autosaveCampaign(id, payload).catch(() => undefined);
    }, 15000);

    return () => clearInterval(interval);
  }, [campaignId, computeScheduleUtcIso, form]);

  useEffect(() => {
    const subject = safeSearchParams.get("subject");
    const senderName = safeSearchParams.get("senderName");
    const senderEmail = safeSearchParams.get("senderEmail");

    if (subject) form.setValue("emailSubject", subject);
    if (senderName) form.setValue("senderName", senderName);
    if (senderEmail) form.setValue("senderEmail", senderEmail);
  }, [form, safeSearchParams]);

  const syncUrlStep = (nextStep: number) => {
    const next = new URLSearchParams(safeSearchParams.toString());
    next.set("step", String(nextStep));
    if (campaignId) next.set("campaign", campaignId);
    router.replace(`/campaigns/new?${next.toString()}`);
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof CampaignFormData)[] = [];

    // Define which fields to validate for each step
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["campaignName", "campaignType"];
        break;
      case 2:
        fieldsToValidate = ["selectedAudiences"];
        break;
      case 3:
        fieldsToValidate = ["emailSubject", "senderName", "senderEmail"];
        break;
      case 4:
        fieldsToValidate = ["sendOption", "scheduleDate", "scheduleTime"];
        break;
      case 5:
        fieldsToValidate = [];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) return;
    if (!campaignId) {
      if (bootstrapError) {
        toast.error(bootstrapError);
        return;
      }
      toast.error("Campaign is still being created. Try again in a moment.");
      return;
    }

    try {
      if (currentStep === 1) {
        const data = form.getValues();
        await campaignsService.updateCampaign(campaignId, {
          name: data.campaignName,
          type: data.campaignType,
        });
      }

      if (currentStep === 2) {
        const data = form.getValues();
        const { listIds, segmentIds } = partitionAudienceSelection(
          data.selectedAudiences,
          audienceSegmentsQuery.data ?? []
        );

        await campaignsService.setAudience(campaignId, { listIds, segmentIds });
        await campaignsService
          .estimateAudience(campaignId)
          .catch(() => undefined);
        const utm: Record<string, string> = {};
        if (data.trackingParameters) {
          const addUtm = (key: string, value?: string) => {
            const trimmed = (value ?? "").trim();
            if (trimmed.length > 0) utm[key] = trimmed;
          };
          addUtm("source", data.utmSource);
          addUtm("medium", data.utmMedium);
          addUtm("campaign", data.utmCampaign);
          addUtm("term", data.utmTerm);
          addUtm("content", data.utmContent);
        }
        await campaignsService.updateTracking(campaignId, {
          smartSending: Boolean(data.smartSending),
          trackingParameters: Boolean(data.trackingParameters),
          ...(Object.keys(utm).length > 0 ? { utm } : {}),
        });
      }

      if (currentStep === 3) {
        const data = form.getValues();
        await campaignsService.updateContent(campaignId, {
          subject: data.emailSubject,
          previewText: data.previewText,
          senderName: data.senderName,
          senderEmail: data.senderEmail,
          replyToEmail: data.useReplyTo ? data.replyToEmail : undefined,
        });

        if (data.selectedTemplate && data.selectedTemplate.length > 0) {
          await campaignsService.setTemplate(campaignId, {
            templateId: data.selectedTemplate,
          });
        }
      }

      if (currentStep === 4) {
        const data = form.getValues();
        const scheduleDateIso = computeScheduleUtcIso(data);
        await campaignsService.updateSchedule(campaignId, {
          sendOption: data.sendOption,
          scheduleDate: scheduleDateIso,
          scheduleTime:
            data.sendOption === "schedule" ? data.scheduleTime : undefined,
          timezone: activeTimezone,
        });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to save step";
      toast.error(message);
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      syncUrlStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const nextStep = currentStep - 1;
      setCurrentStep(nextStep);
      syncUrlStep(nextStep);
    }
  };

  const onSubmit = async (_data: CampaignFormData) => {
    if (!campaignId) {
      toast.error("Missing campaign id.");
      return;
    }
    if (!canLaunchCampaigns) {
      toast.error("Your role cannot launch campaigns for this organization.");
      return;
    }

    try {
      const data = form.getValues();
      const scheduleDateIso = computeScheduleUtcIso(data);
      await campaignsService.updateSchedule(campaignId, {
        sendOption: data.sendOption,
        scheduleDate: scheduleDateIso,
        scheduleTime:
          data.sendOption === "schedule" ? data.scheduleTime : undefined,
        timezone: activeTimezone,
      });

      const validation = await campaignsService.validateCampaign(campaignId);
      if (!validation?.valid) {
        const errors = Array.isArray(validation?.errors)
          ? validation.errors
              .map((e) => {
                if (typeof e === "string") return e;
                if (typeof e === "object" && e !== null && "message" in e) {
                  const m = (e as { message?: unknown }).message;
                  if (typeof m === "string" && m.trim().length > 0) return m;
                }
                return null;
              })
              .filter((m): m is string => Boolean(m && m.length > 0))
          : [];

        toast.error(
          errors.length > 0
            ? `Campaign is not ready: ${errors.slice(0, 3).join(" • ")}`
            : "Campaign is not ready to launch."
        );
        return;
      }

      await campaignsService.launchCampaign(campaignId);
      setShowConfirmation(true);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to launch campaign";
      toast.error(message);
    }
  };

  const sendOption = form.watch("sendOption");
  const scheduleDate = form.watch("scheduleDate");
  const scheduleTime = form.watch("scheduleTime");
  const timezone = form.watch("timezone");

  return (
    <div className="min-h-screen bg-background font-sans -mt-[20px] z-2">
      {/* Header with Progress */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <Link href={PRIVATE_ROUTES.CAMPAIGNS}>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl transition-all duration-300"
              >
                <ArrowLeftIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                Back to campaigns
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground font-medium">
              Step {currentStep} of {TOTAL_STEPS}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 sm:px-6 md:py-6 lg:px-10 max-w-[1440px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-card border border-border rounded-2xl shadow-xl transition-all duration-300">
              {!showConfirmation ? (
                <>
                  {!campaignId && (
                    <div className="border-b border-border p-6 md:p-8 lg:p-10">
                      <div className="text-sm text-muted-foreground">
                        {bootstrapError ?? "Creating campaign draft…"}
                      </div>
                      {bootstrapError && (
                        <div className="mt-4">
                          <Button
                            type="button"
                            onClick={() => {
                              setBootstrapError(null);
                              isBootstrappingInFlightRef.current = false;
                            }}
                            className="rounded-xl"
                          >
                            Retry
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  {currentStep === 1 && <CampaignDetailsStep form={form} />}
                  {currentStep === 2 && (
                    <AudienceStep
                      form={form}
                      campaignId={campaignId}
                      canSync={
                        Boolean(campaignId) &&
                        hasHydratedCampaign &&
                        !isHydratingCampaign &&
                        !isBootstrappingCampaign
                      }
                      lists={audienceUsersQuery.data ?? []}
                      segments={audienceSegmentsQuery.data ?? []}
                      segmentsLoading={audienceSegmentsQuery.isLoading}
                      segmentsError={
                        audienceSegmentsQuery.error instanceof Error
                          ? audienceSegmentsQuery.error.message
                          : null
                      }
                    />
                  )}
                  {currentStep === 3 && (
                    <TemplateStep
                      form={form}
                      campaignId={campaignId}
                      verifiedSenderIdentities={verifiedSenderIdentities}
                      senderIdentitiesLoading={senderIdentitiesQuery.isLoading}
                      canSendEmail={canSendEmail}
                    />
                  )}
                  {currentStep === 4 && <ScheduleStep form={form} />}
                  {currentStep === 5 && (
                    <CampaignPreviewStep form={form} campaignId={campaignId} />
                  )}

                  {/* Navigation Buttons */}
                  {currentStep !== 3 && (
                    <div className="flex items-center justify-between p-6 md:p-8 lg:p-10 border-t border-border">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="rounded-xl transition-all duration-300 disabled:opacity-50"
                      >
                        <ArrowLeftIcon
                          aria-hidden="true"
                          className="mr-2 h-4 w-4"
                        />
                        Back
                      </Button>

                      {currentStep === TOTAL_STEPS ? (
                        <div className="flex flex-col items-end gap-2">
                          {!canLaunchCampaigns && (
                            <div className="text-right text-xs text-muted-foreground">
                              Your role cannot launch campaigns for this
                              organization.
                            </div>
                          )}
                          <Button
                            type="submit"
                            disabled={
                              !campaignId ||
                              isBootstrappingCampaign ||
                              !canLaunchCampaigns
                            }
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
                          >
                            {sendOption === "now"
                              ? "Send Campaign Now"
                              : "Schedule Campaign"}
                            {sendOption === "now" ? (
                              <PaperAirplaneIcon
                                aria-hidden="true"
                                className="ml-2 h-4 w-4"
                              />
                            ) : (
                              <ClockIcon
                                aria-hidden="true"
                                className="ml-2 h-4 w-4"
                              />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleNext}
                          disabled={!campaignId || isBootstrappingCampaign}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 transition-all duration-300 ease-in-out hover:shadow-lg"
                        >
                          Continue
                          <ArrowRightIcon
                            aria-hidden="true"
                            className="ml-2 h-4 w-4"
                          />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Step 3 Navigation (inside TemplateStep component) */}
                  {currentStep === 3 && (
                    <div className="flex items-center justify-between p-6 md:p-8 lg:p-10 border-t border-border">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                        disabled={isBootstrappingCampaign}
                        className="rounded-xl transition-all duration-300"
                      >
                        <ArrowLeftIcon
                          aria-hidden="true"
                          className="mr-2 h-4 w-4"
                        />
                        Back
                      </Button>

                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!campaignId || isBootstrappingCampaign}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 transition-all duration-300 ease-in-out hover:shadow-lg"
                      >
                        Continue
                        <ArrowRightIcon
                          aria-hidden="true"
                          className="ml-2 h-4 w-4"
                        />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <ConfirmationPage
                  sendOption={sendOption}
                  scheduleDate={scheduleDate}
                  scheduleTime={scheduleTime}
                  timezone={timezone}
                />
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
