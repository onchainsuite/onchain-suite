"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart";

const chartData = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  predicted: Math.max(5, 15 - i * 0.8 + Math.random() * 3),
  actual: i < 8 ? Math.max(4, 14 - i * 0.9 + Math.random() * 2) : null,
}));

const chartConfig = {
  predicted: {
    label: "Predicted",
    color: "var(--chart-1)",
  },
  actual: {
    label: "Actual",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function PredictiveChurnChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Churn Analysis</CardTitle>
        <CardDescription>
          AI forecast of user churn over the next 12 weeks
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-predicted)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-predicted)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-actual)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-actual)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="actual"
              type="natural"
              fill="url(#fillActual)"
              fillOpacity={0.4}
              stroke="var(--color-actual)"
              stackId="a"
            />
            <Area
              dataKey="predicted"
              type="natural"
              fill="url(#fillPredicted)"
              fillOpacity={0.4}
              stroke="var(--color-predicted)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Tracking predictions vs actuals <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Week 1 - Week 12
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
