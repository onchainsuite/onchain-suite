"use client";

import { TrendingDown } from "lucide-react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import { type CustomTooltipProps } from "@/r3tain/analytics/dashboard/types";
import { type Channel } from "@/r3tain/analytics/types";

interface FunnelChartProps {
  data: {
    step: string;
    value: number;
    dropOffRate: number;
    color: string;
  }[];
  selectedChannel: Channel;
}

export function FunnelChart({ data, selectedChannel }: FunnelChartProps) {
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      return (
        data && (
          <div className="bg-popover border-border rounded-lg border p-3 shadow-lg">
            <p className="text-foreground mb-2 font-medium">{label}</p>
            <div className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded"
                style={{ backgroundColor: data.color }}
              />
              <span className="text-muted-foreground">Count:</span>
              <span className="text-foreground font-medium">
                {payload?.[0]?.value?.toLocaleString()}
              </span>
            </div>
            {data.dropOffRate > 0 && (
              <div className="mt-1 flex items-center gap-2 text-sm">
                <TrendingDown className="text-destructive h-3 w-3" />
                <span className="text-muted-foreground">Drop-off:</span>
                <span className="text-destructive font-medium">
                  {data.dropOffRate}%
                </span>
              </div>
            )}
          </div>
        )
      );
    }
    return null;
  };

  return (
    <ChartContainer
      config={{
        value: {
          label: "Count",
          color:
            selectedChannel === "email"
              ? "var(--chart-1)"
              : selectedChannel === "sms"
                ? "var(--chart-2)"
                : "var(--chart-3)",
        },
      }}
      className="h-full w-full lg:h-3/4 lg:w-3/4"
    >
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <XAxis dataKey="step" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <ChartTooltip content={<CustomTooltip />} />
        <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
