"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { chain: "Ethereum", users: 1200, volume: 45.2, engagement: 92 },
  { chain: "Polygon", users: 890, volume: 23.1, engagement: 87 },
  { chain: "Kaia", users: 456, volume: 12.4, engagement: 85 },
  { chain: "Arbitrum", users: 678, volume: 18.9, engagement: 89 },
  { chain: "Avalanche", users: 534, volume: 14.7, engagement: 83 },
  { chain: "Solana", users: 923, volume: 31.5, engagement: 90 },
];

const chartConfig = {
  users: {
    label: "Users (K)",
    color: "var(--chart-1)",
  },
  volume: {
    label: "Volume ($M)",
    color: "var(--chart-2)",
  },
  engagement: {
    label: "Engagement (%)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function CrossChainChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Chain Performance</CardTitle>
        <CardDescription>
          Comparative analysis across all supported chains
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="chain"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="users"
              fill="var(--color-users)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="volume"
              fill="var(--color-volume)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="engagement"
              fill="var(--color-engagement)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
