import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/api-client";
import { getSelectedOrganizationId, isJsonObject } from "@/lib/utils";

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
    const dataObj = isJsonObject(data) ? data : undefined;
    const nestedError = isJsonObject(dataObj?.error)
      ? dataObj.error
      : undefined;
    const message =
      (isJsonObject(nestedError) ? nestedError.message : undefined) ??
      (isJsonObject(dataObj) ? dataObj.message : undefined) ??
      err.message ??
      "Templates request failed";
    throw new Error(String(message));
  }
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

const normalizeTemplate = (raw: unknown): TemplateItem => {
  const obj = isJsonObject(raw) ? raw : {};
  const previewCandidate =
    obj.previewUrl ?? obj.previewURL ?? obj.thumbnailUrl ?? obj.thumbnailURL;

  return {
    id: String(obj.id ?? ""),
    name: String(obj.name ?? obj.title ?? "Untitled"),
    folder: obj.folder ? String(obj.folder) : undefined,
    updatedAt: obj.updatedAt ? String(obj.updatedAt) : undefined,
    createdAt: obj.createdAt ? String(obj.createdAt) : undefined,
    previewUrl: previewCandidate ? String(previewCandidate) : undefined,
    ...obj,
  };
};

export const templatesService = {
  list(params?: ListTemplatesParams, orgId?: string) {
    return request<unknown>(
      { method: "GET", url: "/templates", params },
      orgId
    ).then((d) => {
      return extractList(d).map(normalizeTemplate);
    });
  },

  create(
    body: { name: string; folder?: string; content?: unknown },
    orgId?: string
  ) {
    return request<unknown>(
      { method: "POST", url: "/templates", data: body },
      orgId
    ).then(normalizeTemplate);
  },

  get(id: string, orgId?: string) {
    return request<unknown>(
      { method: "GET", url: `/templates/${id}` },
      orgId
    ).then(normalizeTemplate);
  },

  update(
    id: string,
    body: { name?: string; folder?: string; content?: unknown },
    orgId?: string
  ) {
    return request<unknown>(
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
