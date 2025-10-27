"use client";

import { format } from "date-fns";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { v7 } from "uuid";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import { type CustomTooltipProps } from "@/r3tain/analytics/dashboard/types";
import {
  getMPMetricLabel,
  getMPMetricValue,
  type MessageMetric,
  type MessagePerformanceData,
} from "@/r3tain/analytics/utils";

interface MessagePerformanceChartProps {
  data: MessagePerformanceData[];
  selectedMetric: MessageMetric;
}

export function MessagePerformanceChart({
  data,
  selectedMetric,
}: MessagePerformanceChartProps) {
  const chartData = data.map((message) => ({
    name: message.name,
    value: getMPMetricValue(message, selectedMetric),
    type: message.type,
    date: message.date,
    sent: message.sent,
    opens: message.opens,
    clicks: message.clicks,
    openRate: message.openRate,
    clickRate: message.clickRate,
  }));

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      const formattedDate = format(data.date, "MMMM d, yyyy");
      const metricLabel = getMPMetricLabel(selectedMetric);
      const typeLabel = data.type.toUpperCase();

      return (
        <div className="bg-popover border-border min-w-[200px] rounded-lg border p-3 shadow-lg">
          <p className="text-foreground mb-2 font-medium">{formattedDate}</p>
          <p className="text-foreground mb-2 text-sm font-medium">
            {typeLabel}: {data.name}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <div
              className="h-3 w-3 rounded"
              style={{
                backgroundColor: data.type === "email" ? "#8b5cf6" : "#22c55e",
              }}
            />
            <span className="text-muted-foreground">{metricLabel}:</span>
            <span className="text-foreground font-medium">
              {data.value.toFixed(1)}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate interval for X-axis labels based on data length
  const getXAxisInterval = () => {
    if (data.length <= 6) return 0; // Show all labels for 6 or fewer items
    if (data.length <= 10) return 1; // Show every other label
    return Math.floor(data.length / 4); // Show approximately 4 labels
  };

  return (
    <ChartContainer
      config={{
        email: {
          label: "Email",
          color: "#8b5cf6", // Purple color for email
        },
        sms: {
          label: "SMS",
          color: "#22c55e", // Green color for SMS
        },
      }}
      className="h-full w-full"
    >
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={140}
          interval={getXAxisInterval()}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
          domain={[0, 100]}
        />
        <ChartTooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          name={getMPMetricLabel(selectedMetric)}
          radius={[6, 6, 0, 0]}
        >
          {chartData.map((entry) => (
            <Cell
              key={v7()}
              fill={entry.type === "email" ? "#8b5cf6" : "#22c55e"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
