export interface Segment {
  id: string;
  name: string;
  matchCount?: number;
  profiles?: number;
  revenue?: string;
  matchRate?: number;
  lastUpdated?: string;
  isEmailable?: boolean;
}

export interface Report {
  id: string;
  name: string;
  type: "email" | "automation";
  status: "active" | "completed" | "paused";
  sentDate: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  revenue: number;
  revenueChange: string;
  conversions?: number;
  entries?: number;
  exits?: number;
  exitRate?: number;
  topTrigger?: string;
  topTriggerRevenue?: number;
}
