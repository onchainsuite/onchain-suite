export interface InboxLabel {
  id: string;
  name: string;
  color: string;
}

export interface InboxMessage {
  id: string;
  threadId: string;
  from: string;
  to: string[];
  createdAt: string;
  content: string;
  subject?: string;
  direction?: "inbound" | "outbound";
  attachments?: unknown;
}

export interface InboxThreadListItem {
  id: string;
  folder?: "INBOX" | "SENT" | "ARCHIVE" | "TRASH";
  from?: string;
  fromEmail?: string;
  subject: string;
  snippet: string;
  updatedAt?: string;
  createdAt?: string;
  unreadCount: number;
  starred: boolean;
  hasAttachment?: boolean;
  labels?: InboxLabel[];
}

export interface InboxThreadDetail extends InboxThreadListItem {
  messages: InboxMessage[];
}
