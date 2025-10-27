"use client";

import { TrendingDown } from "lucide-react";

import { type Channel } from "@/r3tain/analytics/types";
import type { FunnelDataPoint } from "@/r3tain/analytics/utils";

interface FunnelStepsDetailsProps {
  data: FunnelDataPoint[];
  selectedChannel: Channel;
}

export function FunnelStepsDetails({
  data,
  selectedChannel,
}: FunnelStepsDetailsProps) {
  return (
    <div className="border-border border-t pt-6">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {data.map((step, index) => (
          <div key={step.step} className="space-y-2 text-center">
            <div className="relative">
              <h4 className="text-foreground border-foreground inline-block border-b-2 border-dotted text-sm font-medium">
                {step.step}
              </h4>
            </div>
            <div className="space-y-1">
              <div className="text-foreground text-2xl font-bold">
                {selectedChannel === "all"
                  ? step.total.toLocaleString()
                  : selectedChannel === "email"
                    ? step.email.toLocaleString()
                    : step.sms.toLocaleString()}
              </div>
              {step.dropOffRate > 0 && (
                <div className="flex items-center justify-center gap-1 text-sm">
                  <TrendingDown className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground">
                    {step.dropOffRate}%
                  </span>
                  <span className="text-muted-foreground">Drop-off</span>
                </div>
              )}
              {step.dropOffRate === 0 && index < data.length - 1 && (
                <div className="text-muted-foreground text-sm">Drop-off</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
