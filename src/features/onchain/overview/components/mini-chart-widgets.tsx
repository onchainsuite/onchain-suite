"use client";

import { Area, AreaChart } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: Math.floor(Math.random() * 1000) + 500,
}));

const widgets = [
  {
    title: "Daily Active Users",
    description: "Last 30 days",
    color: "var(--chart-1)",
  },
  {
    title: "Transaction Volume",
    description: "Last 30 days",
    color: "var(--chart-2)",
  },
  {
    title: "New Wallets",
    description: "Last 30 days",
    color: "var(--chart-3)",
  },
];

export function MiniChartWidgets() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {widgets.map((widget) => {
        const chartConfig = {
          value: {
            label: widget.title,
            color: widget.color,
          },
        } satisfies ChartConfig;

        return (
          <Card key={widget.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {widget.title}
              </CardTitle>
              <CardDescription className="text-xs">
                {widget.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-20 w-full">
                <AreaChart
                  data={data}
                  margin={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}
                >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="value"
                    type="monotone"
                    fill="var(--color-value)"
                    fillOpacity={0.3}
                    stroke="var(--color-value)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
