"use client";

import { useMemo, useState } from "react";

import { FunnelChannelSelector } from "./funnel-channel-selector";
import { FunnelChart } from "./funnel-chart";
import { FunnelRevenueDisplay } from "./funnel-revenue-display";
import { FunnelStepsDetails } from "./funnel-steps-details";
import type { Channel } from "@/r3tain/analytics/types";
import { generateFunnelData } from "@/r3tain/analytics/utils";

export function ConversionFunnel() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>("email");

  const funnelData = useMemo(() => {
    return generateFunnelData(selectedChannel);
  }, [selectedChannel]);

  const chartData = funnelData.map((item) => ({
    step: item.step,
    value:
      selectedChannel === "all"
        ? item.total
        : selectedChannel === "email"
          ? item.email
          : item.sms,
    dropOffRate: item.dropOffRate,
    color:
      selectedChannel === "email"
        ? "var(--chart-1)"
        : selectedChannel === "sms"
          ? "var(--chart-2)"
          : "var(--chart-3)",
  }));

  const totalRevenue = funnelData[0]?.total || 0;
  const revenuePerRecipient =
    totalRevenue > 0 ? (1203 / totalRevenue).toFixed(2) : "0";

  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse justify-between gap-6 sm:flex-row sm:items-center">
        <FunnelRevenueDisplay revenuePerRecipient={revenuePerRecipient} />
        <FunnelChannelSelector
          selectedChannel={selectedChannel}
          onChannelChange={setSelectedChannel}
        />
      </div>

      <div className="space-y-4">
        <FunnelChart data={chartData} selectedChannel={selectedChannel} />
      </div>

      <FunnelStepsDetails data={funnelData} selectedChannel={selectedChannel} />
    </div>
  );
}
