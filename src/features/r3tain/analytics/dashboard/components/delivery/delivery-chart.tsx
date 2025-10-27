"use client";

import {
  Dot,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import { type Primitive } from "@/types/ui";

import type {
  CustomDotProps,
  CustomTooltipProps,
} from "@/r3tain/analytics/dashboard/types";
import { type DeliveryMetric, getMetricLabel } from "@/r3tain/analytics/utils";

interface DeliveryChartProps {
  data: {
    period: string;
    value: number;
    date: Date;
    [key: string]: Primitive;
  }[];
  selectedMetric: DeliveryMetric;
}

export function DeliveryChart({ data, selectedMetric }: DeliveryChartProps) {
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload?.length) {
      return (
        <div className="bg-popover border-border rounded-lg border p-3 shadow-lg">
          <p className="text-foreground mb-2 font-medium">{label}</p>
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-chart-1 h-3 w-3 rounded-full" />
            <span className="text-muted-foreground">
              {getMetricLabel(selectedMetric)}:
            </span>
            <span className="text-foreground font-medium">
              {payload?.[0]?.value?.toFixed(1)}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: CustomDotProps) => {
    const { cx, cy } = props;
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
  const getXAxisInterval = () => {
    if (data.length <= 7) return 0; // Show all labels for 7 or fewer items
    if (data.length <= 12) return 1; // Show every other label
    return Math.floor(data.length / 6); // Show approximately 6 labels
  };

  return (
    <ChartContainer
      config={{
        value: {
          label: getMetricLabel(selectedMetric),
          color: "var(--chart-1)",
        },
      }}
      className="h-[80%] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
        >
          <XAxis
            dataKey="period"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
            interval={getXAxisInterval()}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
            domain={[0, "dataMax + 2"]}
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
      </ResponsiveContainer>
    </ChartContainer>
  );
}
