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
  /** Explicit profile/contact ids — backend requires the key to be an array. */
  profileIds?: string[];
}

export interface CampaignAudienceEstimate {
  recipients?: number;
  estimatedRecipients?: number;
  /** Canonical field per POST /campaigns/{id}/audience/estimate. */
  recipientCount?: number;
  excludedBySmartSending?: number;
  [key: string]: unknown;
}

/**
 * The campaign's in-app push variant (docs/backend.md). Saved via
 * `PUT /campaigns/{id}` as `pushContent` (stored under `channelsContent.inapp`)
 * and consumed by `POST /campaigns/{id}/send-inapp`.
 */
export interface CampaignPushContent {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface CampaignSendInAppResult {
  campaignRunId?: string;
  recipientCount?: number;
  deliveredNowCount?: number;
  skippedCount?: number;
  [key: string]: unknown;
}

/**
 * Engagement analytics (docs/backend.md). Rates are percentages (2 dp);
 * open/click denominators use `delivered` when ACS delivery events exist,
 * falling back to `sent`.
 */
export interface CampaignEmailFunnel {
  sent?: number;
  delivered?: number;
  failed?: number;
  bounces?: number;
  complaints?: number;
  suppressed?: number;
  unsubscribes?: number;
  uniqueOpens?: number;
  totalClicks?: number;
  uniqueClicks?: number;
  deliveryRate?: number;
  openRate?: number;
  clickRate?: number;
  clickToOpenRate?: number;
  bounceRate?: number;
  unsubscribeRate?: number;
  [key: string]: unknown;
}

export interface CampaignInAppFunnel {
  sent?: number;
  delivered?: number;
  viewed?: number;
  clicked?: number;
  dismissed?: number;
  deliveryRate?: number;
  viewRate?: number;
  clickRate?: number;
  dismissRate?: number;
  [key: string]: unknown;
}

export interface CampaignAnalytics {
  campaignId?: string;
  email?: CampaignEmailFunnel;
  inapp?: CampaignInAppFunnel;
  totals?: { messagesSent?: number };
  [key: string]: unknown;
}

export interface CampaignAnalyticsOverview {
  rangeDays?: number;
  email?: CampaignEmailFunnel;
  inapp?: CampaignInAppFunnel;
  totals?: { messagesSent?: number };
  /** Shared monthly message allowance; limit/remaining are null on unlimited tiers. */
  allowance?: {
    limitKey?: string;
    limit?: number | null;
    used?: number;
    remaining?: number | null;
  };
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
  text?: string;
  assets?: unknown;
  /** In-app push variant; `null` clears it (POST /campaigns/{id}/editor/saved). */
  push?: CampaignPushContent | null;
  [key: string]: unknown;
}

export interface CampaignRenderRequest extends CampaignEditorContent {
  subject?: string;
  previewText?: string;
  senderName?: string;
  senderEmail?: string;
  replyToEmail?: string;
  to?: string;
  recipient?: unknown;
  contact?: unknown;
  audience?: unknown;
}

export interface CampaignRenderResponse extends CampaignEditorContent {
  id?: string;
  subject?: string;
  previewText?: string;
  senderName?: string;
  senderEmail?: string;
  replyToEmail?: string;
  missingFields?: string[];
  warnings?: string[];
  source?: {
    campaignId?: string;
    templateId?: string;
    renderedAt?: string;
    recipient?: unknown;
    [key: string]: unknown;
  };
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
    const status = err.response?.status;
    const data = err.response?.data;
    const nestedError =
      isJsonObject(data) && isJsonObject(data.error) ? data.error : undefined;
    const message = isJsonObject(nestedError)
      ? nestedError.message
      : isJsonObject(data)
        ? data.message
        : (err.message ?? "Campaigns request failed");
    throw new Error(
      status ? `[HTTP ${status}] ${String(message)}` : String(message),
      { cause: e }
    );
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
  typeof value === "string" &&
  campaignStatuses.has(value as Campaign["status"]);

const apiCampaignTypeFromUi: Record<Campaign["type"], string> = {
  "email-blast": "EMAIL_BLAST",
  "drip-campaign": "DRIP_CAMPAIGN",
  "smart-sending": "SMART_SENDING",
  newsletter: "NEWSLETTER",
  promotional: "PROMOTIONAL",
  announcement: "ANNOUNCEMENT",
  automation: "AUTOMATION",
};

const uiCampaignTypeFromApi: Record<string, Campaign["type"]> =
  Object.fromEntries(
    Object.entries(apiCampaignTypeFromUi).map(([ui, api]) => [
      api,
      ui as Campaign["type"],
    ])
  ) as Record<string, Campaign["type"]>;

const apiCampaignStatusFromUi: Record<Campaign["status"], string> = {
  draft: "DRAFT",
  scheduled: "SCHEDULED",
  sending: "SENDING",
  sent: "SENT",
  paused: "PAUSED",
  failed: "FAILED",
};

const uiCampaignStatusFromApi: Record<string, Campaign["status"]> =
  Object.fromEntries(
    Object.entries(apiCampaignStatusFromUi).map(([ui, api]) => [
      api,
      ui as Campaign["status"],
    ])
  ) as Record<string, Campaign["status"]>;

const normalizeApiEnumKey = (value: string) =>
  value.trim().toUpperCase().replaceAll("-", "_");

const toUiCampaignType = (value: unknown): Campaign["type"] | undefined => {
  if (isCampaignType(value)) return value;
  if (typeof value !== "string") return undefined;
  return uiCampaignTypeFromApi[normalizeApiEnumKey(value)];
};

const toUiCampaignStatus = (value: unknown): Campaign["status"] | undefined => {
  if (isCampaignStatus(value)) return value;
  if (typeof value !== "string") return undefined;
  return uiCampaignStatusFromApi[normalizeApiEnumKey(value)];
};

const toApiCampaignType = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  if (isCampaignType(value)) return apiCampaignTypeFromUi[value];
  const normalized = normalizeApiEnumKey(value);
  return uiCampaignTypeFromApi[normalized] ? normalized : undefined;
};

const toApiCampaignStatus = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  if (isCampaignStatus(value)) return apiCampaignStatusFromUi[value];
  const normalized = normalizeApiEnumKey(value);
  return uiCampaignStatusFromApi[normalized] ? normalized : undefined;
};

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
  const type = toUiCampaignType(obj.type) ?? "email-blast";
  const status = toUiCampaignStatus(obj.status) ?? "draft";

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
    const nextBody: Record<string, unknown> = { ...body };
    if ("type" in nextBody) {
      const mappedType = toApiCampaignType(nextBody.type);
      if (mappedType) nextBody.type = mappedType;
    }
    if ("status" in nextBody) {
      const mappedStatus = toApiCampaignStatus(nextBody.status);
      if (mappedStatus) nextBody.status = mappedStatus;
    }
    return request<unknown>(
      { method: "POST", url: "/campaigns", data: nextBody },
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
    const nextBody: Record<string, unknown> = { ...body };
    if ("type" in nextBody) {
      const mappedType = toApiCampaignType(nextBody.type);
      if (mappedType) nextBody.type = mappedType;
    }
    if ("status" in nextBody) {
      const mappedStatus = toApiCampaignStatus(nextBody.status);
      if (mappedStatus) nextBody.status = mappedStatus;
    }
    return request<unknown>(
      { method: "PUT", url: `/campaigns/${id}`, data: nextBody },
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
    // The backend DTO requires `profileIds` to be present as an array (of
    // strings) even when targeting only lists/segments.
    const payload = {
      listIds: Array.isArray(body.listIds) ? body.listIds : [],
      segmentIds: Array.isArray(body.segmentIds) ? body.segmentIds : [],
      profileIds: Array.isArray(body.profileIds) ? body.profileIds : [],
    };
    return request<{ success?: boolean }>(
      { method: "PUT", url: `/campaigns/${id}/audience`, data: payload },
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

  getEmailContent(id: string, orgId?: string) {
    return request<CampaignRenderResponse>(
      { method: "GET", url: `/campaigns/${id}/email` },
      orgId
    );
  },

  saveEmailContent(id: string, body: CampaignRenderRequest, orgId?: string) {
    return request<CampaignRenderResponse & { success?: boolean }>(
      { method: "PUT", url: `/campaigns/${id}/email`, data: body },
      orgId
    );
  },

  preview(id: string, body?: CampaignRenderRequest, orgId?: string) {
    return request<CampaignRenderResponse>(
      { method: "POST", url: `/campaigns/${id}/preview`, data: body },
      orgId
    );
  },

  sendTest(
    id: string,
    body: CampaignRenderRequest & { to: string },
    orgId?: string
  ) {
    return request<{
      success?: boolean;
      messageId?: string;
      renderedAt?: string;
      htmlLength?: number;
      textLength?: number;
    }>(
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

  deleteCampaign(id: string, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "DELETE", url: `/campaigns/${id}` },
      orgId
    );
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

  /**
   * Ensure the campaign has its delivery channel enabled — the launch
   * validator rejects campaigns with an empty `channelsUsed` ("At least one
   * channel is required"). `PUT /campaigns/{id}/channels` is documented for
   * smart-campaign channels (inapp/telegram/discord/x), so if it rejects a
   * value (e.g. "email"), fall back to the campaign-update path.
   */
  async ensureChannels(id: string, channelsUsed: string[], orgId?: string) {
    try {
      await request<unknown>(
        {
          method: "PUT",
          url: `/campaigns/${id}/channels`,
          data: { channelsUsed },
        },
        orgId
      );
    } catch {
      await request<unknown>(
        { method: "PUT", url: `/campaigns/${id}`, data: { channelsUsed } },
        orgId
      );
    }
  },

  /**
   * Save the campaign's in-app push variant (title/body/CTA). Stored under
   * `channelsContent.inapp` and auto-enables the INAPP channel; consumed by
   * sendInAppPush (docs/backend.md, PUT /campaigns/{id}).
   */
  setPushContent(id: string, push: CampaignPushContent, orgId?: string) {
    return request<unknown>(
      { method: "PUT", url: `/campaigns/${id}`, data: { pushContent: push } },
      orgId
    );
  },

  /**
   * Send the campaign's in-app push to its wallet-reachable audience
   * (docs/backend.md, POST /campaigns/{id}/send-inapp). Content precedence:
   * body overrides → saved `channelsContent.inapp` → the linked in-app
   * template. Immediate fan-out — there is no scheduled push send.
   */
  sendInAppPush(
    id: string,
    overrides?: Partial<CampaignPushContent>,
    orgId?: string
  ) {
    return request<CampaignSendInAppResult>(
      {
        method: "POST",
        url: `/campaigns/${id}/send-inapp`,
        data: overrides ?? {},
      },
      orgId
    );
  },

  /** Per-campaign engagement funnel (GET /campaigns/{id}/analytics). */
  getAnalytics(id: string, orgId?: string) {
    return request<CampaignAnalytics>(
      { method: "GET", url: `/campaigns/${id}/analytics` },
      orgId
    );
  },

  /**
   * Org-wide per-channel funnels + monthly message allowance
   * (GET /campaigns/analytics/overview?days=, 1–90, default 30).
   */
  getAnalyticsOverview(days = 30, orgId?: string) {
    return request<CampaignAnalyticsOverview>(
      {
        method: "GET",
        url: "/campaigns/analytics/overview",
        params: { days },
      },
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
        const rawId = String(obj.id ?? obj.value ?? "");
        const normalizedId = toUiCampaignType(rawId) ?? rawId;
        const rest: Record<string, unknown> = { ...obj };
        delete rest.id;
        delete rest.value;
        delete rest.label;
        return {
          ...rest,
          id: normalizedId,
          label: obj.label ? String(obj.label) : undefined,
        } as CampaignTypeItem;
      })
    );
  },
};
