import type { CampaignStatus, CampaignType } from "../../campaigns/types";

export function getStatusColor(status: CampaignStatus): string {
  const colors: Record<CampaignStatus, string> = {
    draft: "bg-muted text-muted-foreground",
    scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    sending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    sent: "bg-green-500/10 text-green-600 dark:text-green-400",
    paused: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    failed: "bg-red-500/10 text-red-600 dark:text-red-400",
  };
  return colors[status];
}

export function getCampaignStatusColor(status: CampaignStatus): string {
  const colors: Record<CampaignStatus, string> = {
    draft: "text-muted-foreground",
    scheduled: "text-blue-500",
    sending: "text-yellow-500",
    sent: "text-green-500",
    paused: "text-orange-500",
    failed: "text-red-500",
  };
  return colors[status];
}

export function getCampaignTypeColor(type: CampaignType): string {
  const colors: Record<CampaignType, string> = {
    newsletter: "bg-blue-500/10 text-blue-600",
    promotional: "bg-purple-500/10 text-purple-600",
    announcement: "bg-green-500/10 text-green-600",
    automation: "bg-orange-500/10 text-orange-600",
    "email-blast": "bg-blue-500/10 text-blue-600",
    "drip-campaign": "bg-purple-500/10 text-purple-600",
    "smart-sending": "bg-green-500/10 text-green-600",
  };
  return colors[type];
}

export function formatPercentage(value?: number): string {
  if (value === undefined) return "—";
  return `${value.toFixed(1)}%`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
