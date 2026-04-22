import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/api-client";
import { getSelectedOrganizationId } from "@/lib/utils";

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

const extractData = <T>(payload: any): T => {
  return (payload?.data ?? payload) as T;
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
    const err = e as AxiosError<any>;
    const message =
      err?.response?.data?.error?.message ??
      err?.response?.data?.message ??
      err?.message ??
      "Campaigns request failed";
    throw new Error(String(message));
  }
};

const toCampaign = (raw: any): Campaign => {
  const createdAt = raw?.createdAt
    ? new Date(String(raw.createdAt))
    : new Date();
  const scheduledFor = raw?.scheduledFor
    ? new Date(String(raw.scheduledFor))
    : undefined;
  const sentAt = raw?.sentAt ? new Date(String(raw.sentAt)) : undefined;

  return {
    id: String(raw?.id ?? ""),
    name: String(raw?.name ?? raw?.title ?? "Untitled"),
    type: (raw?.type ?? "email-blast") as any,
    status: (raw?.status ?? "draft") as any,
    subject: String(raw?.subject ?? ""),
    audience: Array.isArray(raw?.audience) ? raw.audience : [],
    recipients: Number(raw?.recipients ?? raw?.recipientCount ?? 0),
    openRate: raw?.openRate !== undefined ? Number(raw.openRate) : undefined,
    clickRate: raw?.clickRate !== undefined ? Number(raw.clickRate) : undefined,
    createdAt,
    scheduledFor,
    sentAt,
  };
};

export const campaignsService = {
  listCampaigns(params?: ListCampaignsParams, orgId?: string) {
    return request<any>(
      { method: "GET", url: "/campaigns", params },
      orgId
    ).then((d) => {
      const list = (d as any)?.items ?? (d as any)?.data ?? d;
      const arr = Array.isArray(list) ? list : [];
      return arr.map(toCampaign);
    });
  },

  createCampaign(body: Record<string, unknown>, orgId?: string) {
    return request<any>(
      { method: "POST", url: "/campaigns", data: body },
      orgId
    ).then(toCampaign);
  },

  getCampaign(id: string, orgId?: string) {
    return request<any>({ method: "GET", url: `/campaigns/${id}` }, orgId).then(
      toCampaign
    );
  },

  updateCampaign(id: string, body: Record<string, unknown>, orgId?: string) {
    return request<any>(
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
    return request<any>(
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
    return request<any[]>(
      { method: "GET", url: `/campaigns/${id}/events` },
      orgId
    ).then((d) => {
      const list = (d as any)?.items ?? (d as any)?.data ?? d;
      return Array.isArray(list) ? list : [];
    });
  },

  launchCampaign(id: string, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "POST", url: `/campaigns/${id}/launch` },
      orgId
    );
  },

  getCalendar(orgId?: string) {
    return request<any>(
      { method: "GET", url: "/campaigns/calendar" },
      orgId
    ).then((d) => {
      const list = (d as any)?.items ?? (d as any)?.data ?? d;
      const arr = Array.isArray(list) ? (list as CampaignCalendarItem[]) : [];
      return arr;
    });
  },

  listCampaignTypes(orgId?: string) {
    return request<any>({ method: "GET", url: "/campaign-types" }, orgId).then(
      (d) => {
        const list = (d as any)?.items ?? (d as any)?.data ?? d;
        const arr = Array.isArray(list) ? list : [];
        return arr.map((t: any) => ({
          id: String(t?.id ?? t?.value ?? ""),
          label: t?.label ? String(t.label) : undefined,
          ...t,
        })) as CampaignTypeItem[];
      }
    );
  },
};
