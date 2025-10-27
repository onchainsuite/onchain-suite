"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import { type Radius } from "@/r3tain/analytics/dashboard/types";
import { type Channel, type ChartDataPoint } from "@/r3tain/analytics/types";

interface ConversionsChartProps {
  data: ChartDataPoint[];
  selectedChannel: Channel;
}

// Type for tooltip payload entry
interface TooltipPayloadEntry {
  value: number;
  dataKey: string;
  color: string;
  name?: string;
}

// Type for tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

export function ConversionsChart({
  data,
  selectedChannel,
}: ConversionsChartProps) {
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload?.length) {
      const total = payload.reduce(
        (sum: number, entry: TooltipPayloadEntry) => sum + entry.value,
        0
      );
      return (
        <div className="bg-popover border-border rounded-lg border p-3 shadow-lg">
          <p className="text-foreground mb-2 font-medium">{label}</p>
          {payload.map(
            (entry: TooltipPayloadEntry, index: number) =>
              entry.value > 0 && (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div
                    className="h-3 w-3 rounded"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground capitalize">
                    {entry.dataKey}:
                  </span>
                  <span className="text-foreground font-medium">
                    ${entry.value.toLocaleString()}
                  </span>
                </div>
              )
          )}
          <div className="border-border mt-2 border-t pt-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-muted-foreground">Total:</span>
              <span className="text-foreground">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate interval for X-axis labels based on data length
  const getXAxisInterval = (): number => {
    if (data.length <= 7) return 0; // Show all labels for 7 or fewer items
    if (data.length <= 12) return 1; // Show every other label
    return Math.floor(data.length / 6); // Show approximately 6 labels
  };

  // Determine which channels are showing
  const showEmail = selectedChannel !== "sms";
  const showSms = selectedChannel !== "email";
  const showBoth = showEmail && showSms;

  // Calculate radius based on what's showing
  const getEmailRadius = (): Radius => {
    if (showBoth) {
      return [0, 0, 4, 4]; // Rounded bottom when stacked
    } else if (showEmail) {
      return [4, 4, 4, 4]; // Fully rounded when alone
    }
    return [0, 0, 4, 4]; // Default
  };

  const getSmsRadius = (): Radius => {
    if (showBoth) {
      return [4, 4, 0, 0]; // Rounded top when stacked
    } else if (showSms) {
      return [4, 4, 4, 4]; // Fully rounded when alone
    }
    return [4, 4, 0, 0]; // Default
  };

  // Type-safe tick formatter
  const tickFormatter = (value: number): string => `$${value.toLocaleString()}`;

  return (
    <ChartContainer
      config={{
        email: {
          label: "Email",
          color: "var(--chart-1)",
        },
        sms: {
          label: "SMS",
          color: "var(--chart-2)",
        },
      }}
      className="h-[80%] w-full"
    >
      <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="period"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={100}
          interval={getXAxisInterval()}
        />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={tickFormatter} />
        <ChartTooltip cursor content={<CustomTooltip />} />
        {selectedChannel !== "sms" && (
          <Bar
            dataKey="email"
            stackId="a"
            fill="var(--color-email)"
            name="Email"
            radius={getEmailRadius()}
            style={{ cursor: "pointer" }}
          />
        )}
        {selectedChannel !== "email" && (
          <Bar
            dataKey="sms"
            stackId="a"
            fill="var(--color-sms)"
            name="SMS"
            radius={getSmsRadius()}
            style={{ cursor: "pointer" }}
          />
        )}
      </BarChart>
    </ChartContainer>
  );
}
