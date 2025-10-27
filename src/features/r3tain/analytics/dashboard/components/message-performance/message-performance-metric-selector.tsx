"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { MessageMetric } from "@/r3tain/analytics/utils";

const metrics: { value: MessageMetric; label: string }[] = [
  { value: "open-rate", label: "Open rate" },
  { value: "click-rate", label: "Click rate" },
];

interface MessagePerformanceMetricSelectorProps {
  selectedMetric: MessageMetric;
  onMetricChange: (metric: MessageMetric) => void;
}

export function MessagePerformanceMetricSelector({
  selectedMetric,
  onMetricChange,
}: MessagePerformanceMetricSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">Metric:</span>
      <Select value={selectedMetric} onValueChange={onMetricChange}>
        <SelectTrigger className="border-primary w-auto min-w-[120px] border-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {metrics.map((metric) => (
            <SelectItem key={metric.value} value={metric.value}>
              {metric.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
