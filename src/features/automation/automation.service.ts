import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/api-client";
import { getSelectedOrganizationId, isJsonObject } from "@/lib/utils";

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
        : typeof data === "string"
          ? data
          : (err.message ?? "Automations request failed");
    throw new Error(String(message));
  }
};

export type AutomationsStatus =
  | "draft"
  | "active"
  | "paused"
  | "archived"
  | string;

export type AutomationsListParams = {
  status?: "draft" | "active" | "paused" | string;
  tab?: "drafts" | string;
  search?: string;
  page?: number;
  limit?: number;
};

export type AutomationsSearchParams = {
  q?: string;
  page?: number;
  limit?: number;
};

export type AutomationsCountsResponse = {
  active: number;
  drafts: number;
  templates: number;
};

export type AutomationsMetricsResponse = {
  active: number;
  entries: number;
  conversions: number;
  revenue: number;
};

export type AutomationsCreateBody = {
  name: string;
  description?: string;
  triggerSpec?: unknown;
  trigger?: unknown;
  flowGraph?: unknown;
  builder?: unknown;
  steps?: unknown;
};

export type AutomationsCreateResponse = {
  automationId: string;
  status: "draft" | string;
};

export type AutomationStatusUpdateBody = {
  status: "active" | "paused" | "draft" | "archived" | string;
};

export const automationService = {
  listAutomations(params?: AutomationsListParams, orgId?: string) {
    return request<
      | { items?: unknown[]; meta?: unknown }
      | { data?: unknown[]; meta?: unknown }
      | unknown[]
    >({ method: "GET", url: "/automations", params }, orgId);
  },

  searchAutomations(params?: AutomationsSearchParams, orgId?: string) {
    return request<{ items?: unknown[]; meta?: unknown } | unknown[]>(
      { method: "GET", url: "/automations/search", params },
      orgId
    );
  },

  getCounts(orgId?: string) {
    return request<AutomationsCountsResponse>(
      { method: "GET", url: "/automations/counts" },
      orgId
    );
  },

  getMetrics(orgId?: string) {
    return request<AutomationsMetricsResponse>(
      { method: "GET", url: "/automations/metrics" },
      orgId
    );
  },

  createAutomation(body: AutomationsCreateBody, orgId?: string) {
    return request<AutomationsCreateResponse>(
      { method: "POST", url: "/automations", data: body },
      orgId
    );
  },

  getAutomation(automationId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/automations/${automationId}` },
      orgId
    );
  },

  updateAutomation(automationId: string, body: Record<string, unknown>, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "PUT", url: `/automations/${automationId}`, data: body },
      orgId
    );
  },

  updateAutomationStatus(
    automationId: string,
    body: AutomationStatusUpdateBody,
    orgId?: string
  ) {
    return request<Record<string, unknown>>(
      { method: "PUT", url: `/automations/${automationId}/status`, data: body },
      orgId
    );
  },

  publishAutomation(automationId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "POST", url: `/automations/${automationId}/publish` },
      orgId
    );
  },

  duplicateAutomation(automationId: string, orgId?: string) {
    return request<{ automationId?: string } & Record<string, unknown>>(
      { method: "POST", url: `/automations/${automationId}/duplicate` },
      orgId
    );
  },

  deleteAutomation(automationId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "DELETE", url: `/automations/${automationId}` },
      orgId
    );
  },

  getLastEdited(automationId: string, orgId?: string) {
    return request<{ lastEditedAt?: string } & Record<string, unknown>>(
      { method: "GET", url: `/automations/${automationId}/last-edited` },
      orgId
    );
  },

  listTemplates(orgId?: string) {
    return request<{ items?: unknown[] } | unknown[]>(
      { method: "GET", url: "/automations/templates" },
      orgId
    );
  },

  getTemplate(templateId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/automations/templates/${templateId}` },
      orgId
    );
  },

  applyTemplate(templateId: string, orgId?: string) {
    return request<{ automationId?: string } & Record<string, unknown>>(
      {
        method: "POST",
        url: `/automations/templates/${templateId}/apply`,
      },
      orgId
    );
  },

  getBuilder(automationId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/automations/${automationId}/builder` },
      orgId
    );
  },

  saveBuilder(automationId: string, body: Record<string, unknown>, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "PUT", url: `/automations/${automationId}/builder`, data: body },
      orgId
    );
  },

  saveBuilderDraft(
    automationId: string,
    body: Record<string, unknown>,
    orgId?: string
  ) {
    return request<Record<string, unknown>>(
      {
        method: "PUT",
        url: `/automations/${automationId}/builder/draft`,
        data: body,
      },
      orgId
    );
  },

  validateBuilder(automationId: string, body: Record<string, unknown>, orgId?: string) {
    return request<{ errors?: unknown[]; warnings?: unknown[] } & Record<string, unknown>>(
      {
        method: "POST",
        url: `/automations/${automationId}/builder/validate`,
        data: body,
      },
      orgId
    );
  },

  discardBuilder(automationId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "POST", url: `/automations/${automationId}/builder/discard` },
      orgId
    );
  },

  listTriggerTypes(orgId?: string) {
    return request<{ items?: unknown[] } | unknown[]>(
      { method: "GET", url: "/automations/builder/triggers" },
      orgId
    );
  },

  getTriggerSchema(triggerType: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/automations/builder/triggers/${triggerType}` },
      orgId
    );
  },

  listAvailableTriggers(orgId?: string) {
    return request<{ items?: unknown[] } | unknown[]>(
      { method: "GET", url: "/automations/triggers/available" },
      orgId
    );
  },

  listActionTypes(orgId?: string) {
    return request<{ items?: unknown[] } | unknown[]>(
      { method: "GET", url: "/automations/builder/actions" },
      orgId
    );
  },

  getActionSchema(actionType: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/automations/builder/actions/${actionType}` },
      orgId
    );
  },

  previewAutomation(automationId: string, body: Record<string, unknown>, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "POST", url: `/automations/${automationId}/preview`, data: body },
      orgId
    );
  },

  getStatsOverview(automationId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/automations/${automationId}/stats` },
      orgId
    );
  },

  getStatsPreview(automationId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/automations/${automationId}/stats/preview` },
      orgId
    );
  },

  getStatsTimeSeries(
    automationId: string,
    params?: { period?: "7days" | "30days" | "90days" | string },
    orgId?: string
  ) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/automations/${automationId}/stats/time-series`, params },
      orgId
    );
  },

  getStatsPaths(automationId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/automations/${automationId}/stats/paths` },
      orgId
    );
  },

  listStatsEntries(
    automationId: string,
    params?: { page?: number; limit?: number; sort?: string },
    orgId?: string
  ) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/automations/${automationId}/stats/entries`, params },
      orgId
    );
  },

  getStatsEntryDetails(automationId: string, entryId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      {
        method: "GET",
        url: `/automations/${automationId}/stats/entries/${entryId}`,
      },
      orgId
    );
  },

  getStatsRevenue(automationId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/automations/${automationId}/stats/revenue` },
      orgId
    );
  },

  getPerformance(automationId: string, orgId?: string) {
    return request<Record<string, unknown>>(
      { method: "GET", url: `/automations/${automationId}/performance` },
      orgId
    );
  },
};

