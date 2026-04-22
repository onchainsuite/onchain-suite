import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/api-client";
import { getSelectedOrganizationId, isJsonObject } from "@/lib/utils";

import type { Campaign } from "./types/campaign";

export interface ListCampaignsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface CampaignCalendarItem {
  id: string;
  name: string;
  status?: string;
  scheduledFor?: string;
  sentAt?: string;
  [key: string]: unknown;
}

export interface CampaignAudienceSelection {
  listIds: string[];
  segmentIds: string[];
}

export interface CampaignAudienceEstimate {
  recipients?: number;
  estimatedRecipients?: number;
  [key: string]: unknown;
}

export interface CampaignTrackingSettings {
  smartSending: boolean;
  trackingParameters: boolean;
  utm?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CampaignContentMetadata {
  subject: string;
  previewText?: string;
  senderName: string;
  senderEmail: string;
  replyToEmail?: string;
  [key: string]: unknown;
}

export interface CampaignScheduleSettings {
  sendOption: "now" | "schedule";
  scheduleDate?: string;
  scheduleTime?: string;
  timezone?: string;
  [key: string]: unknown;
}

export interface CampaignValidateResult {
  valid: boolean;
  errors?: unknown[];
  [key: string]: unknown;
}

export interface CampaignEditorSession {
  editorUrl?: string;
  token?: string;
  expiresAt?: string;
  [key: string]: unknown;
}

export interface CampaignEditorContent {
  html?: string;
  json?: unknown;
  textVersion?: string;
  assets?: unknown;
  [key: string]: unknown;
}

export interface CampaignTypeItem {
  id: string;
  label?: string;
  [key: string]: unknown;
}

const pickOrgId = (orgId?: string) =>
  orgId ?? getSelectedOrganizationId() ?? null;

const extractData = <T>(payload: unknown): T => {
  if (isJsonObject(payload) && "data" in payload) {
    return payload.data as T;
  }
  return payload as T;
};

const request = async <T>(
  config: AxiosRequestConfig,
  orgId?: string
): Promise<T> => {
  const resolvedOrgId = pickOrgId(orgId);
  const headers = {
    ...(config.headers ?? {}),
    ...(resolvedOrgId ? { "x-org-id": resolvedOrgId } : {}),
    "x-onchain-silent-error": "1",
  };

  try {
    const res = await apiClient.request<T>({ ...config, headers });
    return extractData<T>(res.data);
  } catch (e) {
    const err = e as AxiosError<unknown>;
    const data = err.response?.data;
    const nestedError =
      isJsonObject(data) && isJsonObject(data.error) ? data.error : undefined;
    const message = isJsonObject(nestedError)
      ? nestedError.message
      : isJsonObject(data)
        ? data.message
        : (err.message ?? "Campaigns request failed");
    throw new Error(String(message));
  }
};

const campaignTypes = new Set<Campaign["type"]>([
  "email-blast",
  "drip-campaign",
  "smart-sending",
  "newsletter",
  "promotional",
  "announcement",
  "automation",
]);
const campaignStatuses = new Set<Campaign["status"]>([
  "draft",
  "scheduled",
  "sending",
  "sent",
  "paused",
  "failed",
]);

const isCampaignType = (value: unknown): value is Campaign["type"] =>
  typeof value === "string" && campaignTypes.has(value as Campaign["type"]);

const isCampaignStatus = (value: unknown): value is Campaign["status"] =>
  typeof value === "string" && campaignStatuses.has(value as Campaign["status"]);

const extractList = (payload: unknown): unknown[] => {
  const root =
    isJsonObject(payload) && "data" in payload
      ? (payload.data ?? payload)
      : payload;
  if (Array.isArray(root)) return root;
  if (isJsonObject(root) && Array.isArray(root.items)) return root.items;
  if (isJsonObject(root) && Array.isArray(root.data)) return root.data;
  return [];
};

const toCampaign = (raw: unknown): Campaign => {
  const obj = isJsonObject(raw) ? raw : {};
  const createdAt = obj.createdAt
    ? new Date(String(obj.createdAt))
    : new Date();
  const scheduledFor = obj.scheduledFor
    ? new Date(String(obj.scheduledFor))
    : undefined;
  const sentAt = obj.sentAt ? new Date(String(obj.sentAt)) : undefined;
  const type = isCampaignType(obj.type) ? obj.type : "email-blast";
  const status = isCampaignStatus(obj.status) ? obj.status : "draft";

  return {
    id: String(obj.id ?? ""),
    name: String(obj.name ?? obj.title ?? "Untitled"),
    type,
    status,
    subject: String(obj.subject ?? ""),
    audience: Array.isArray(obj.audience) ? obj.audience.map(String) : [],
    recipients: Number(obj.recipients ?? obj.recipientCount ?? 0),
    openRate: obj.openRate !== undefined ? Number(obj.openRate) : undefined,
    clickRate: obj.clickRate !== undefined ? Number(obj.clickRate) : undefined,
    createdAt,
    scheduledFor,
    sentAt,
  };
};

export const campaignsService = {
  listCampaigns(params?: ListCampaignsParams, orgId?: string) {
    return request<unknown>(
      { method: "GET", url: "/campaigns", params },
      orgId
    ).then((d) => extractList(d).map(toCampaign));
  },

  createCampaign(body: Record<string, unknown>, orgId?: string) {
    return request<unknown>(
      { method: "POST", url: "/campaigns", data: body },
      orgId
    ).then(toCampaign);
  },

  getCampaign(id: string, orgId?: string) {
    return request<unknown>(
      { method: "GET", url: `/campaigns/${id}` },
      orgId
    ).then(toCampaign);
  },

  updateCampaign(id: string, body: Record<string, unknown>, orgId?: string) {
    return request<unknown>(
      { method: "PUT", url: `/campaigns/${id}`, data: body },
      orgId
    ).then(toCampaign);
  },

  autosaveCampaign(id: string, body: Record<string, unknown>, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "POST", url: `/campaigns/${id}/autosave`, data: body },
      orgId
    );
  },

  setAudience(id: string, body: CampaignAudienceSelection, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "PUT", url: `/campaigns/${id}/audience`, data: body },
      orgId
    );
  },

  getAudience(id: string, orgId?: string) {
    return request<CampaignAudienceSelection>(
      { method: "GET", url: `/campaigns/${id}/audience` },
      orgId
    );
  },

  estimateAudience(id: string, orgId?: string) {
    return request<CampaignAudienceEstimate>(
      { method: "POST", url: `/campaigns/${id}/audience/estimate` },
      orgId
    );
  },

  updateTracking(id: string, body: CampaignTrackingSettings, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "PUT", url: `/campaigns/${id}/tracking`, data: body },
      orgId
    );
  },

  getTracking(id: string, orgId?: string) {
    return request<CampaignTrackingSettings>(
      { method: "GET", url: `/campaigns/${id}/tracking` },
      orgId
    );
  },

  updateContent(id: string, body: CampaignContentMetadata, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "PUT", url: `/campaigns/${id}/content`, data: body },
      orgId
    );
  },

  getContent(id: string, orgId?: string) {
    return request<CampaignContentMetadata>(
      { method: "GET", url: `/campaigns/${id}/content` },
      orgId
    );
  },

  setTemplate(id: string, body: { templateId: string }, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "PUT", url: `/campaigns/${id}/template`, data: body },
      orgId
    );
  },

  getEditorSession(id: string, orgId?: string) {
    return request<CampaignEditorSession>(
      { method: "GET", url: `/campaigns/${id}/editor-session` },
      orgId
    );
  },

  editorSaved(id: string, body: CampaignEditorContent, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "POST", url: `/campaigns/${id}/editor/saved`, data: body },
      orgId
    );
  },

  getEditorContent(id: string, orgId?: string) {
    return request<CampaignEditorContent>(
      { method: "GET", url: `/campaigns/${id}/editor/content` },
      orgId
    );
  },

  preview(id: string, orgId?: string) {
    return request<{ html?: string; text?: string }>(
      { method: "POST", url: `/campaigns/${id}/preview` },
      orgId
    );
  },

  sendTest(
    id: string,
    body: { to: string; subjectOverride?: string },
    orgId?: string
  ) {
    return request<{ success?: boolean }>(
      { method: "POST", url: `/campaigns/${id}/send-test`, data: body },
      orgId
    );
  },

  updateSchedule(id: string, body: CampaignScheduleSettings, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "PUT", url: `/campaigns/${id}/schedule`, data: body },
      orgId
    );
  },

  getSchedule(id: string, orgId?: string) {
    return request<CampaignScheduleSettings>(
      { method: "GET", url: `/campaigns/${id}/schedule` },
      orgId
    );
  },

  validateCampaign(id: string, orgId?: string) {
    return request<CampaignValidateResult>(
      { method: "POST", url: `/campaigns/${id}/validate` },
      orgId
    );
  },

  duplicateCampaign(id: string, orgId?: string) {
    return request<unknown>(
      { method: "POST", url: `/campaigns/${id}/duplicate` },
      orgId
    ).then(toCampaign);
  },

  cancelCampaign(id: string, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "POST", url: `/campaigns/${id}/cancel` },
      orgId
    );
  },

  getEvents(id: string, orgId?: string) {
    return request<unknown>(
      { method: "GET", url: `/campaigns/${id}/events` },
      orgId
    ).then((d) => extractList(d));
  },

  launchCampaign(id: string, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "POST", url: `/campaigns/${id}/launch` },
      orgId
    );
  },

  getCalendar(orgId?: string) {
    return request<unknown>(
      { method: "GET", url: "/campaigns/calendar" },
      orgId
    ).then((d) =>
      extractList(d).map((item) => {
        const obj = isJsonObject(item) ? item : {};
        return {
          id: String(obj.id ?? ""),
          name: String(obj.name ?? ""),
          status: typeof obj.status === "string" ? obj.status : undefined,
          scheduledFor:
            typeof obj.scheduledFor === "string" ? obj.scheduledFor : undefined,
          sentAt: typeof obj.sentAt === "string" ? obj.sentAt : undefined,
          ...obj,
        } as CampaignCalendarItem;
      })
    );
  },

  listCampaignTypes(orgId?: string) {
    return request<unknown>(
      { method: "GET", url: "/campaign-types" },
      orgId
    ).then((d) =>
      extractList(d).map((t) => {
        const obj = isJsonObject(t) ? t : {};
        return {
          id: String(obj.id ?? obj.value ?? ""),
          label: obj.label ? String(obj.label) : undefined,
          ...obj,
        } as CampaignTypeItem;
      })
    );
  },
};
