"use client";

import { useQuery } from "@tanstack/react-query";

import { campaignsService } from "../../campaigns.service";
import type { Campaign } from "../../types";
import { formatPercentage } from "../../utils";

/**
 * Statuses for which the backend can hold engagement events. Draft/scheduled
 * campaigns have never sent anything, so they render "—" (never 0%) and no
 * analytics request is made for them.
 */
const SENT_LIKE_STATUSES: ReadonlySet<Campaign["status"]> = new Set([
  "sent",
  "sending",
  "paused",
  "failed",
]);

interface CampaignRateCellProps {
  campaign: Campaign;
  metric: "openRate" | "clickRate";
}

/**
 * Email open/click rate for one campaign row, sourced from
 * `GET /campaigns/{id}/analytics` (docs/backend.md — rates are percentages,
 * 2 dp). Prefers a rate already present on the list row when the backend
 * provides one.
 *
 * Only mounted rows fetch — the table paginates client-side, so requests are
 * naturally capped at the visible page. The query key matches
 * `CampaignAnalyticsDialog`, so results are cached once per campaign and
 * reused across cells/dialog.
 */
export function CampaignRateCell({ campaign, metric }: CampaignRateCellProps) {
  const listRate =
    metric === "openRate" ? campaign.openRate : campaign.clickRate;
  const canHaveStats = SENT_LIKE_STATUSES.has(campaign.status);

  const analyticsQuery = useQuery({
    queryKey: ["campaigns", "analytics", campaign.id],
    queryFn: () => campaignsService.getAnalytics(campaign.id),
    enabled: canHaveStats && listRate === undefined && campaign.id.length > 0,
    retry: false,
  });

  let value: number | undefined;
  if (canHaveStats) {
    if (listRate !== undefined) {
      value = listRate;
    } else {
      const email = analyticsQuery.data?.email;
      // Only show a rate once emails actually went out; a failed/paused
      // campaign with zero sends stays "—" instead of a misleading 0%.
      value = (email?.sent ?? 0) > 0 ? email?.[metric] : undefined;
    }
  }

  if (canHaveStats && listRate === undefined && analyticsQuery.isLoading) {
    return (
      <div
        className="h-4 w-10 animate-pulse rounded bg-muted"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="text-sm text-foreground">{formatPercentage(value)}</div>
  );
}
