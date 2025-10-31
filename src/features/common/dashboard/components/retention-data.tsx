import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart";

const retentionData = [
  { day: "D1", retention: 100 },
  { day: "D2", retention: 85 },
  { day: "D3", retention: 78 },
  { day: "D4", retention: 76 },
  { day: "D5", retention: 75 },
  { day: "D6", retention: 76 },
  { day: "D7", retention: 76 },
];

const chartConfig = {
  retention: {
    label: "Retention",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export const RetentionChart = () => {
  return (
    <div className="h-64">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart
          accessibilityLayer
          data={retentionData}
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
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="retention"
            type="monotone"
            stroke="var(--color-retention)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
