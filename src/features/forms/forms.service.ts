import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/api-client";
import { getSelectedOrganizationId, isJsonObject } from "@/lib/utils";

/** A capture form (Email-to-Wallet), as returned by the backend `present()`. */
export interface CaptureForm {
  id: string;
  name: string;
  publicToken: string;
  status: "active" | "paused" | "archived" | string;
  fields: CaptureFieldSpec[];
  settings: Record<string, unknown>;
  allowedOrigins: string[];
  apiConnected: boolean;
  zkEnabled: boolean;
  tag: string | null;
  submissionCount: number;
  lastSubmissionAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** Public submit URL + copy-paste embed snippet. */
  submitUrl: string;
  embedCode: string;
}

export interface CaptureFieldSpec {
  key: string;
  label?: string;
  type?: "email" | "text" | "wallet";
  required?: boolean;
}

export interface CreateFormInput {
  name: string;
  tag?: string;
  allowedOrigins?: string[];
  fields?: CaptureFieldSpec[];
  settings?: Record<string, unknown>;
  zkEnabled?: boolean;
}

export interface UpdateFormInput {
  name?: string;
  tag?: string | null;
  allowedOrigins?: string[];
  fields?: CaptureFieldSpec[];
  settings?: Record<string, unknown>;
  status?: string;
  zkEnabled?: boolean;
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
        : typeof data === "string"
          ? data
          : (err.message ?? "Forms request failed");
    throw new Error(String(message), { cause: e });
  }
};

const extractItems = <T>(payload: unknown): T[] => {
  const root = extractData<unknown>(payload);
  if (Array.isArray(root)) return root as T[];
  if (isJsonObject(root) && Array.isArray(root.items)) return root.items as T[];
  if (isJsonObject(root) && Array.isArray(root.data)) return root.data as T[];
  return [];
};

/** Typed client for the Email-to-Wallet capture-forms API. */
export const formsService = {
  listForms(orgId?: string) {
    return request<unknown>({ method: "GET", url: "/forms" }, orgId).then((r) =>
      extractItems<CaptureForm>(r)
    );
  },

  getForm(id: string, orgId?: string) {
    return request<CaptureForm>({ method: "GET", url: `/forms/${id}` }, orgId);
  },

  createForm(body: CreateFormInput, orgId?: string) {
    return request<CaptureForm>(
      { method: "POST", url: "/forms", data: body },
      orgId
    );
  },

  updateForm(id: string, body: UpdateFormInput, orgId?: string) {
    return request<CaptureForm>(
      { method: "PATCH", url: `/forms/${id}`, data: body },
      orgId
    );
  },

  /** Connect the form to the API — auto-enables ZK encryption on captures. */
  connectForm(id: string, orgId?: string) {
    return request<CaptureForm>(
      { method: "POST", url: `/forms/${id}/connect` },
      orgId
    );
  },

  deleteForm(id: string, orgId?: string) {
    return request<{ deleted: boolean }>(
      { method: "DELETE", url: `/forms/${id}` },
      orgId
    );
  },
};
