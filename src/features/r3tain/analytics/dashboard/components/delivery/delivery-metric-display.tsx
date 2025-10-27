"use client";

import { type DeliveryMetric, getMetricLabel } from "@/r3tain/analytics/utils";

interface DeliveryMetricDisplayProps {
  selectedMetric: DeliveryMetric;
}

export function DeliveryMetricDisplay({
  selectedMetric,
}: DeliveryMetricDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <span className="text-primary border-primary border-b-2 border-dotted text-sm font-medium">
          {getMetricLabel(selectedMetric)}
        </span>
      </div>
      <div className="space-y-1">
        <div className="text-foreground text-3xl font-bold">--</div>
        <div className="text-muted-foreground text-sm">--</div>
      </div>
    </div>
  );
}
