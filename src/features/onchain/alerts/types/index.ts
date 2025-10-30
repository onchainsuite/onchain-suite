import { type LucideIcon } from "lucide-react";

// Types
export type AlertSeverity = "high" | "medium" | "low";
export type AlertStatus = "Active" | "Resolved" | "Snoozed";
export type AlertType = "Critical" | "Warning" | "Info";
export type FilterOption = "all" | "active" | "resolved" | "snoozed";

export interface Alert {
  name: string;
  type: AlertType;
  severity: AlertSeverity;
  timestamp: string;
  description: string;
  icon: LucideIcon;
  status: AlertStatus;
}
