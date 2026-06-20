import type { AxiosError, AxiosRequestConfig } from "axios";
import { io, type Socket } from "socket.io-client";

import { apiClient } from "@/lib/api-client";
import {
  getCookieValue,
  getSelectedOrganizationId,
  isJsonObject,
} from "@/lib/utils";

export type InboxFolder = "INBOX" | "SENT" | "ARCHIVE" | "TRASH";

export type InboxLabel = { id: string; name: string; color: string };

export type InboxMessage = {
  id: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  content: string;
  attachments?: unknown;
  createdAt: string;
  direction?: "inbound" | "outbound";
};

export type InboxThreadListItem = {
  id: string;
  subject: string;
  snippet: string;
  folder: InboxFolder;
  unreadCount: number;
  starred: boolean;
  labels?: InboxLabel[];
  updatedAt: string;
  createdAt: string;
  [key: string]: unknown;
};

export type InboxThreadsListResponse = {
  items: InboxThreadListItem[];
  meta: {
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
};

type InboxDraft = {
  id: string;
  to?: string[];
  subject?: string;
  content: string;
  attachments?: unknown;
  updatedAt: string;
  createdAt: string;
};

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
          : (err.message ?? "Inbox request failed");
    throw new Error(String(message), { cause: e });
  }
};

export const inboxService = {
  listThreads(
    params?: {
      folder?: InboxFolder;
      unread?: boolean;
      starred?: boolean;
      labelId?: string;
      q?: string;
      page?: number;
      limit?: number;
    },
    orgId?: string
  ) {
    return request<InboxThreadsListResponse>(
      { method: "GET", url: "/inbox/threads", params },
      orgId
    );
  },

  getUnreadCount(orgId?: string) {
    return request<{ unreadCount: number }>(
      { method: "GET", url: "/inbox/threads/unread-count" },
      orgId
    );
  },

  getThread(threadId: string, orgId?: string) {
    return request<InboxThreadListItem & { messages?: InboxMessage[] }>(
      { method: "GET", url: `/inbox/threads/${threadId}` },
      orgId
    );
  },

  listThreadMessages(
    threadId: string,
    params?: { cursor?: string; limit?: number },
    orgId?: string
  ) {
    return request<{ items: InboxMessage[]; nextCursor: string | null }>(
      { method: "GET", url: `/inbox/threads/${threadId}/messages`, params },
      orgId
    );
  },

  sendReply(
    threadId: string,
    body: {
      content: string;
      to?: string;
      fromEmail?: string;
      attachments?: unknown;
    },
    orgId?: string
  ) {
    return request<{ ok: true; messageId: string }>(
      {
        method: "POST",
        url: `/inbox/threads/${threadId}/messages`,
        data: body,
      },
      orgId
    );
  },

  sendNewMessage(
    body: {
      to: string[] | string;
      subject: string;
      content: string;
      fromEmail?: string;
      attachments?: unknown;
    },
    orgId?: string
  ) {
    return request<{ ok: true; threadId: string; messageId: string }>(
      { method: "POST", url: "/inbox/messages", data: body },
      orgId
    );
  },

  markThreadRead(threadId: string, orgId?: string) {
    return request<{ ok: true }>(
      { method: "PUT", url: `/inbox/threads/${threadId}/read` },
      orgId
    );
  },

  markThreadUnread(threadId: string, orgId?: string) {
    return request<{ ok: true }>(
      { method: "PUT", url: `/inbox/threads/${threadId}/unread` },
      orgId
    );
  },

  toggleThreadStar(
    threadId: string,
    body?: { starred?: boolean },
    orgId?: string
  ) {
    return request<{ ok: true; starred: boolean }>(
      {
        method: "PUT",
        url: `/inbox/threads/${threadId}/star`,
        data: body ?? {},
      },
      orgId
    );
  },

  updateThreadLabels(
    threadId: string,
    body: { add?: string[]; remove?: string[] },
    orgId?: string
  ) {
    return request<{ ok: true; labels: InboxLabel[] }>(
      { method: "PUT", url: `/inbox/threads/${threadId}/label`, data: body },
      orgId
    );
  },

  listLabels(orgId?: string) {
    return request<{ items: InboxLabel[] }>(
      { method: "GET", url: "/inbox/labels" },
      orgId
    );
  },

  createLabel(body: { name: string; color?: string }, orgId?: string) {
    return request<InboxLabel>(
      { method: "POST", url: "/inbox/labels", data: body },
      orgId
    );
  },

  globalSearch(params: { q: string; limit?: number }, orgId?: string) {
    return request<{ threads: unknown[]; messages: unknown[] }>(
      { method: "GET", url: "/inbox/search", params },
      orgId
    );
  },

  listDrafts(orgId?: string) {
    return request<{ items: InboxDraft[] }>(
      { method: "GET", url: "/inbox/drafts" },
      orgId
    );
  },

  createDraft(
    body: {
      to?: string[];
      subject?: string;
      content: string;
      attachments?: unknown;
    },
    orgId?: string
  ) {
    return request<InboxDraft>(
      { method: "POST", url: "/inbox/drafts", data: body },
      orgId
    );
  },

  updateDraft(
    draftId: string,
    body: {
      to?: string[];
      subject?: string;
      content?: string;
      attachments?: unknown;
    },
    orgId?: string
  ) {
    return request<InboxDraft>(
      { method: "PUT", url: `/inbox/drafts/${draftId}`, data: body },
      orgId
    );
  },
};

export function connectInboxSocket(orgId?: string | null): Socket {
  const organizationId = orgId ?? getSelectedOrganizationId() ?? "";
  const token = getCookieValue("onchain.token") ?? "";
  return io("/inbox", {
    path: "/ws/inbox",
    withCredentials: true,
    auth: {
      token: token.length > 0 ? token : undefined,
      organizationId: organizationId.length > 0 ? organizationId : undefined,
    },
  });
}
