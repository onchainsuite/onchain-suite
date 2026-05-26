import { EventEmitter } from "events";

export type InboxFolder = "INBOX" | "SENT" | "ARCHIVE" | "TRASH";

export type InboxLabel = {
  id: string;
  name: string;
  color: string;
};

export type InboxMessage = {
  id: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  content: string;
  attachments?: unknown;
  createdAt: string;
  direction: "inbound" | "outbound";
};

export type InboxThread = {
  id: string;
  subject: string;
  snippet: string;
  folder: InboxFolder;
  unreadCount: number;
  starred: boolean;
  labelIds: string[];
  messageIds: string[];
  updatedAt: string;
  createdAt: string;
};

export type InboxDraft = {
  id: string;
  to?: string[];
  subject?: string;
  content: string;
  attachments?: unknown;
  updatedAt: string;
  createdAt: string;
};

export type InboxStore = {
  threads: Map<string, InboxThread>;
  messages: Map<string, InboxMessage>;
  labels: Map<string, InboxLabel>;
  drafts: Map<string, InboxDraft>;
};

type RealtimeEventMap = {
  new_message: { orgId: string; threadId: string; message: InboxMessage };
  thread_updated: { orgId: string; threadId: string; patch?: unknown };
  unread_count_changed: { orgId: string; unreadCount: number };
};

export interface InboxEvents extends EventEmitter {
  emit<K extends keyof RealtimeEventMap>(
    event: K,
    payload: RealtimeEventMap[K]
  ): boolean;
  on<K extends keyof RealtimeEventMap>(
    event: K,
    listener: (payload: RealtimeEventMap[K]) => void
  ): this;
  off<K extends keyof RealtimeEventMap>(
    event: K,
    listener: (payload: RealtimeEventMap[K]) => void
  ): this;
}

const g = globalThis as unknown as {
  __onchainInboxEvents?: InboxEvents;
  __onchainInboxStores?: Map<string, InboxStore>;
};

export const inboxEvents: InboxEvents =
  g.__onchainInboxEvents ?? (new EventEmitter() as InboxEvents);
g.__onchainInboxEvents = inboxEvents;

const stores = g.__onchainInboxStores ?? new Map<string, InboxStore>();
g.__onchainInboxStores = stores;

const randomId = () => {
  const cryptoObj = (globalThis as unknown as { crypto?: unknown }).crypto;
  if (
    cryptoObj &&
    typeof (cryptoObj as { randomUUID?: unknown }).randomUUID === "function"
  ) {
    return (cryptoObj as { randomUUID: () => string }).randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getInboxStore = (orgId: string, userKey: string): InboxStore => {
  const key = `${orgId}::${userKey}`;
  const existing = stores.get(key);
  if (existing) return existing;
  const created: InboxStore = {
    threads: new Map(),
    messages: new Map(),
    labels: new Map(),
    drafts: new Map(),
  };
  stores.set(key, created);
  return created;
};

export const createLabel = (
  store: InboxStore,
  input: { name: string; color?: string }
) => {
  const id = randomId();
  const color =
    input.color && input.color.trim().length > 0 ? input.color : "#64748b";
  const label: InboxLabel = { id, name: input.name, color };
  store.labels.set(id, label);
  return label;
};

export const ensureDefaultLabels = (store: InboxStore) => {
  if (store.labels.size > 0) return;
  createLabel(store, { name: "Support", color: "#0ea5e9" });
  createLabel(store, { name: "VIP", color: "#f59e0b" });
  createLabel(store, { name: "Bug", color: "#ef4444" });
};

export const createThreadWithMessage = (
  store: InboxStore,
  input: Omit<InboxMessage, "id" | "createdAt"> & { createdAt?: string }
) => {
  const now = input.createdAt ?? new Date().toISOString();
  const threadId =
    input.threadId && input.threadId.length > 0 ? input.threadId : randomId();
  const messageId = randomId();
  const message: InboxMessage = {
    id: messageId,
    threadId,
    from: input.from,
    to: input.to,
    subject: input.subject,
    content: input.content,
    attachments: input.attachments,
    createdAt: now,
    direction: input.direction,
  };
  store.messages.set(messageId, message);

  const snippet = input.content.replace(/\s+/g, " ").trim().slice(0, 160);
  const thread: InboxThread = {
    id: threadId,
    subject: input.subject,
    snippet,
    folder: "INBOX",
    unreadCount: input.direction === "inbound" ? 1 : 0,
    starred: false,
    labelIds: [],
    messageIds: [messageId],
    updatedAt: now,
    createdAt: now,
  };
  store.threads.set(threadId, thread);
  return { thread, message };
};

export const appendMessageToThread = (
  store: InboxStore,
  threadId: string,
  input: Omit<InboxMessage, "id" | "createdAt" | "threadId"> & {
    createdAt?: string;
  }
) => {
  const thread = store.threads.get(threadId);
  if (!thread) return null;
  const now = input.createdAt ?? new Date().toISOString();
  const messageId = randomId();
  const message: InboxMessage = {
    id: messageId,
    threadId,
    from: input.from,
    to: input.to,
    subject: input.subject,
    content: input.content,
    attachments: input.attachments,
    createdAt: now,
    direction: input.direction,
  };
  store.messages.set(messageId, message);

  thread.messageIds.push(messageId);
  thread.updatedAt = now;
  thread.subject = input.subject || thread.subject;
  thread.snippet = input.content.replace(/\s+/g, " ").trim().slice(0, 160);
  if (input.direction === "inbound") {
    thread.unreadCount = Math.max(1, thread.unreadCount + 1);
    if (thread.folder === "SENT") thread.folder = "INBOX";
  }
  store.threads.set(threadId, thread);
  return { thread, message };
};
