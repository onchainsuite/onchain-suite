import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/api-client";
import { getSelectedOrganizationId } from "@/lib/utils";

export interface TemplateItem {
  id: string;
  name: string;
  folder?: string;
  updatedAt?: string;
  createdAt?: string;
  previewUrl?: string;
  [key: string]: unknown;
}

export interface ListTemplatesParams {
  search?: string;
  sort?: string;
  page?: number;
  folder?: string;
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
      "Templates request failed";
    throw new Error(String(message));
  }
};

const normalizeTemplate = (raw: any): TemplateItem => {
  const previewCandidate =
    raw?.previewUrl ??
    raw?.previewURL ??
    raw?.thumbnailUrl ??
    raw?.thumbnailURL;

  return {
    id: String(raw?.id ?? ""),
    name: String(raw?.name ?? raw?.title ?? "Untitled"),
    folder: raw?.folder ? String(raw.folder) : undefined,
    updatedAt: raw?.updatedAt ? String(raw.updatedAt) : undefined,
    createdAt: raw?.createdAt ? String(raw.createdAt) : undefined,
    previewUrl: previewCandidate ? String(previewCandidate) : undefined,
    ...raw,
  };
};

export const templatesService = {
  list(params?: ListTemplatesParams, orgId?: string) {
    return request<any>(
      { method: "GET", url: "/templates", params },
      orgId
    ).then((d) => {
      const list = (d as any)?.items ?? (d as any)?.data ?? d;
      const arr = Array.isArray(list) ? list : [];
      return arr.map(normalizeTemplate);
    });
  },

  create(
    body: { name: string; folder?: string; content?: unknown },
    orgId?: string
  ) {
    return request<any>(
      { method: "POST", url: "/templates", data: body },
      orgId
    ).then(normalizeTemplate);
  },

  get(id: string, orgId?: string) {
    return request<any>({ method: "GET", url: `/templates/${id}` }, orgId).then(
      normalizeTemplate
    );
  },

  update(
    id: string,
    body: { name?: string; folder?: string; content?: unknown },
    orgId?: string
  ) {
    return request<any>(
      { method: "PUT", url: `/templates/${id}`, data: body },
      orgId
    ).then(normalizeTemplate);
  },

  remove(id: string, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "DELETE", url: `/templates/${id}` },
      orgId
    );
  },
};
