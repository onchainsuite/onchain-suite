import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/api-client";
import { getSelectedOrganizationId } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title?: string;
  message?: string;
  type?: string;
  read?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

export interface ListNotificationsParams {
  page?: number;
  limit?: number;
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
      "Notifications request failed";
    throw new Error(String(message));
  }
};

const normalizeNotification = (raw: any): NotificationItem => {
  return {
    id: String(raw?.id ?? ""),
    title: raw?.title ? String(raw.title) : undefined,
    message: raw?.message
      ? String(raw.message)
      : raw?.body
        ? String(raw.body)
        : undefined,
    type: raw?.type ? String(raw.type) : undefined,
    read: raw?.read !== undefined ? Boolean(raw.read) : undefined,
    createdAt: raw?.createdAt ? String(raw.createdAt) : undefined,
    ...raw,
  };
};

export const notificationsService = {
  list(params?: ListNotificationsParams, orgId?: string) {
    return request<any>(
      { method: "GET", url: "/notifications", params },
      orgId
    ).then((d) => {
      const list = (d as any)?.items ?? (d as any)?.data ?? d;
      const arr = Array.isArray(list) ? list : [];
      return arr.map(normalizeNotification);
    });
  },

  markRead(id: string, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "PUT", url: `/notifications/${id}/read` },
      orgId
    );
  },

  markAllRead(orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "PUT", url: "/notifications/read-all" },
      orgId
    );
  },
};
