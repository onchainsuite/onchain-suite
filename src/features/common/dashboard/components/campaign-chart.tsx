import { Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart";

const chartConfig = {
  value: {
    label: "Count",
  },
  sent: {
    label: "Sent",
    color: "var(--chart-1)",
  },
  opened: {
    label: "Opened",
    color: "var(--chart-2)",
  },
  clicked: {
    label: "Clicked",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const campaignData = [
  { name: "sent", value: 1500, fill: "var(--color-sent)" },
  { name: "opened", value: 780, fill: "var(--color-opened)" },
  { name: "clicked", value: 330, fill: "var(--color-clicked)" },
];
export const CampaignChart = () => {
  return (
    <div className="h-48">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={campaignData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={5}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
};
