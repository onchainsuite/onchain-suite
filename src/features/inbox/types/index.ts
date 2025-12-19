export interface Message {
  id: number;
  from: string;
  to: string;
  time: string;
  content: string;
}

export interface Email {
  id: number;
  from: string;
  email: string;
  profileId: string;
  avatar: string;
  subject: string;
  preview: string;
  time: string;
  date: string;
  unread: boolean;
  starred: boolean;
  hasAttachment: boolean;
  campaign: string;
  thread: Message[];
}
