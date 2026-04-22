import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/api-client";
import { getSelectedOrganizationId, isJsonObject } from "@/lib/utils";

export interface AudienceOverview {
  [key: string]: unknown;
}

export interface AudienceProfile {
  id: string;
  name?: string;
  email?: string;
  wallet?: string;
  status?: string;
  healthScore?: number;
  engagement?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface AudienceTag {
  name: string;
  [key: string]: unknown;
}

export interface ListProfilesParams {
  page?: number;
  limit?: number;
  q?: string;
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
        : (err.message ?? "Audience request failed");
    throw new Error(String(message));
  }
};

export const audienceService = {
  getOverview(orgId?: string) {
    return request<AudienceOverview>(
      { method: "GET", url: "/audience/overview" },
      orgId
    );
  },

  listProfiles(params?: ListProfilesParams, orgId?: string) {
    return request<
      | { items?: AudienceProfile[]; data?: AudienceProfile[] }
      | AudienceProfile[]
    >({ method: "GET", url: "/audience/profiles", params }, orgId);
  },

  createProfile(body: Record<string, unknown>, orgId?: string) {
    return request<AudienceProfile>(
      { method: "POST", url: "/audience/profiles", data: body },
      orgId
    );
  },

  getProfile(id: string, orgId?: string) {
    return request<AudienceProfile>(
      { method: "GET", url: `/audience/profiles/${id}` },
      orgId
    );
  },

  updateProfile(id: string, body: Record<string, unknown>, orgId?: string) {
    return request<AudienceProfile>(
      { method: "PUT", url: `/audience/profiles/${id}`, data: body },
      orgId
    );
  },

  listTags(orgId?: string) {
    return request<
      { items?: AudienceTag[]; data?: AudienceTag[] } | AudienceTag[]
    >({ method: "GET", url: "/audience/tags" }, orgId);
  },

  createTag(body: { name: string }, orgId?: string) {
    return request<AudienceTag>(
      { method: "POST", url: "/audience/tags", data: body },
      orgId
    );
  },

  addTagsToProfile(id: string, body: { tags: string[] }, orgId?: string) {
    return request<{ success?: boolean }>(
      { method: "PUT", url: `/audience/profiles/${id}/tags`, data: body },
      orgId
    );
  },

  removeTagFromProfile(id: string, tagName: string, orgId?: string) {
    return request<{ success?: boolean }>(
      {
        method: "DELETE",
        url: `/audience/profiles/${id}/tags/${encodeURIComponent(tagName)}`,
      },
      orgId
    );
  },
};
