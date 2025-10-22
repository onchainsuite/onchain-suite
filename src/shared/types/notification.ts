export type NotificationType = "info" | "success" | "warning" | "message";

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: Date;
  read: boolean;
  type: NotificationType;
}
