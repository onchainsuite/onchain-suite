"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart";

const generateData = (index: number) => {
  const baseValue = [15000, 120000, 70, 65][index];
  const trend = [1.5, 2.3, 1.1, 0.92][index];

  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    value: Math.floor(
      baseValue * Math.pow(trend, i / 30) + Math.random() * baseValue * 0.1
    ),
  }));
};

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function StoryChart({ index }: { index: number }) {
  const chartData = generateData(index);

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `Day ${value}`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="value"
          type="natural"
          fill="var(--color-value)"
          fillOpacity={0.4}
          stroke="var(--color-value)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
