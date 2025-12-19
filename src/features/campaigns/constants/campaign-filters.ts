import type { FacetedFilterOption } from "../../campaigns/types";

export const CAMPAIGN_STATUS_FILTERS: FacetedFilterOption[] = [
  { label: "Draft", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Sending", value: "sending" },
  { label: "Sent", value: "sent" },
  { label: "Paused", value: "paused" },
  { label: "Failed", value: "failed" },
];

export const CAMPAIGN_TYPE_FILTERS: FacetedFilterOption[] = [
  { label: "Email Blast", value: "email-blast" },
  { label: "Drip Campaign", value: "drip-campaign" },
  { label: "Smart Sending", value: "smart-sending" },
];

export const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  "email-blast": "Email Blast",
  "drip-campaign": "Drip Campaign",
  "smart-sending": "Smart Sending",
};
