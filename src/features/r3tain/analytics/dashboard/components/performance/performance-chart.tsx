"use client";

import { Dot, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import type {
  CustomDotProps,
  CustomTooltipProps,
  PerformanceChartData,
} from "@/r3tain/analytics/dashboard/types";
import {
  getPerformanceMetricLabel,
  isPercentageMetric,
  type PerformanceMetric,
} from "@/r3tain/analytics/utils";

interface PerformanceChartProps {
  data: PerformanceChartData[];
  selectedMetric: PerformanceMetric;
}

export function PerformanceChart({
  data,
  selectedMetric,
}: PerformanceChartProps) {
  const isPercentage = isPercentageMetric(selectedMetric);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload?.length) {
      const [{ value }] = payload;
      if (typeof value !== "number") return null;

      const formattedValue = isPercentage
        ? `${value.toFixed(1)}%`
        : selectedMetric === "clicks-per-unique-opens"
          ? value.toFixed(1)
          : value.toLocaleString();

      return (
        <div className="bg-popover border-border rounded-lg border p-3 shadow-lg">
          <p className="text-foreground mb-2 font-medium">{label}</p>
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-chart-1 h-3 w-3 rounded-full" />
            <span className="text-muted-foreground">
              {getPerformanceMetricLabel(selectedMetric)}:
            </span>
            <span className="text-foreground font-medium">
              {formattedValue}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = ({ cx, cy }: CustomDotProps) => {
    // Only render if we have valid coordinates
    if (typeof cx !== "number" || typeof cy !== "number") return null;

    return (
      <Dot
        cx={cx}
        cy={cy}
        r={4}
        fill="var(--chart-1)"
        stroke="var(--chart-1)"
        strokeWidth={2}
      />
    );
  };

  // Calculate interval for X-axis labels based on data length
  const getXAxisInterval = (): number => {
    if (data.length <= 7) return 0; // Show all labels for 7 or fewer items
    if (data.length <= 12) return 1; // Show every other label
    return Math.floor(data.length / 6); // Show approximately 6 labels
  };

  // Format Y-axis ticks based on metric type
  const formatYAxisTick = (value: number): string => {
    if (isPercentage) {
      return `${value}%`;
    }
    if (selectedMetric === "total-sends") {
      return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString();
    }
    return value.toFixed(1);
  };

  return (
    <ChartContainer
      config={{
        value: {
          label: getPerformanceMetricLabel(selectedMetric),
          color: "var(--chart-1)",
        },
      }}
      className="h-3/4 w-full"
    >
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <XAxis
          dataKey="period"
          tick={{ fontSize: 12 }}
          interval={getXAxisInterval()}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={formatYAxisTick}
          domain={
            isPercentage
              ? [0, "dataMax + 2"]
              : ["dataMin - 10%", "dataMax + 10%"]
          }
        />
        <ChartTooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={<CustomDot />}
          activeDot={{ r: 6, fill: "var(--color-value)" }}
        />
      </LineChart>
    </ChartContainer>
  );
}
