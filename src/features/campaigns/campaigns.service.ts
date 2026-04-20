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

const pickOrgId = (orgId?: string) => orgId ?? getSelectedOrganizationId() ?? null;

const extractData = <T>(payload: any): T => {
  return (payload?.data ?? payload) as T;
};

const request = async <T>(config: AxiosRequestConfig, orgId?: string): Promise<T> => {
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
  const createdAt = raw?.createdAt ? new Date(String(raw.createdAt)) : new Date();
  const scheduledFor = raw?.scheduledFor ? new Date(String(raw.scheduledFor)) : undefined;
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
    return request<any>({ method: "GET", url: "/campaigns", params }, orgId).then((d) => {
      const list = (d as any)?.items ?? (d as any)?.data ?? d;
      const arr = Array.isArray(list) ? list : [];
      return arr.map(toCampaign);
    });
  },

  createCampaign(body: Record<string, unknown>, orgId?: string) {
    return request<any>({ method: "POST", url: "/campaigns", data: body }, orgId).then(toCampaign);
  },

  getCampaign(id: string, orgId?: string) {
    return request<any>({ method: "GET", url: `/campaigns/${id}` }, orgId).then(toCampaign);
  },

  updateCampaign(id: string, body: Record<string, unknown>, orgId?: string) {
    return request<any>({ method: "PUT", url: `/campaigns/${id}`, data: body }, orgId).then(
      toCampaign
    );
  },

  launchCampaign(id: string, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "POST", url: `/campaigns/${id}/launch` },
      orgId
    );
  },

  getCalendar(orgId?: string) {
    return request<any>({ method: "GET", url: "/campaigns/calendar" }, orgId).then((d) => {
      const list = (d as any)?.items ?? (d as any)?.data ?? d;
      const arr = Array.isArray(list) ? (list as CampaignCalendarItem[]) : [];
      return arr;
    });
  },
};

