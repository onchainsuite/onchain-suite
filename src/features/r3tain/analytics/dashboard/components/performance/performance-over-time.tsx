"use client";

import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { v7 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

import { metricOptions } from "./metric-options";
import { PerformanceChart } from "./performance-chart";
import { PerformanceMetricDisplay } from "./performance-metric-display";
import type { Period } from "@/r3tain/analytics/types";
import {
  generatePerformanceDailyData,
  generatePerformanceMonthlyData,
  generatePerformanceWeeklyData,
  getPerformanceMetricValue,
  type PerformanceMetric,
} from "@/r3tain/analytics/utils";

interface PerformanceOverTimeProps {
  dateRange: string;
  startDate: Date;
  endDate: Date;
  comparisonPeriod: string;
}

export function PerformanceOverTime({
  startDate,
  endDate,
  comparisonPeriod,
}: PerformanceOverTimeProps) {
  const [selectedMetric, setSelectedMetric] =
    useState<PerformanceMetric>("click-rate");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("Day");

  const currentMetric = metricOptions.find(
    (option) => option.value === selectedMetric
  );

  // Generate data based on selected period
  const allData = useMemo(() => {
    switch (selectedPeriod) {
      case "Day":
        return generatePerformanceDailyData(30);
      case "Week":
        return generatePerformanceWeeklyData(12);
      case "Month":
      default:
        return generatePerformanceMonthlyData(12);
    }
  }, [selectedPeriod]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return allData.map((item) => ({
      ...item,
      period: item.period,
      value: getPerformanceMetricValue(item, selectedMetric),
      date: item.date,
    }));
  }, [allData, selectedMetric]);

  // Calculate current and comparison values
  const currentValue = useMemo(() => {
    if (chartData.length === 0) return 0;
    // Use the average of recent data points
    const recentData = chartData.slice(-3);
    return (
      recentData.reduce((sum, item) => sum + item.value, 0) / recentData.length
    );
  }, [chartData]);

  const comparisonValue = useMemo(() => {
    if (chartData.length === 0) return 0;
    // Use earlier data points for comparison
    const earlierData = chartData.slice(0, 3);
    return (
      earlierData.reduce((sum, item) => sum + item.value, 0) /
      earlierData.length
    );
  }, [chartData]);

  // Sample stats
  const getSampleStats = () => {
    return [
      { label: "Total message count", value: "34" },
      {
        label: "Total messages sent",
        value: chartData
          .reduce((sum, item) => sum + (item.totalSends || 0), 0)
          .toLocaleString(),
      },
    ];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const dateRangeText = `${formatDate(startDate)} - ${formatDate(endDate)}`;
  const comparisonText = `Compared to last ${comparisonPeriod} days`;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="space-y-2">
            <CardTitle className="text-foreground text-xl">
              Performance over time
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {dateRangeText} • {comparisonText}
            </CardDescription>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {/* Metric Selector */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Metric:</span>
              <Select
                value={selectedMetric}
                onValueChange={(value: PerformanceMetric) =>
                  setSelectedMetric(value)
                }
              >
                <SelectTrigger className="border-primary w-auto min-w-[140px] border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>ENGAGEMENT</SelectLabel>
                    {metricOptions
                      .filter((option) => option.group === "engagement")
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {selectedMetric === option.value && (
                              <Check className="text-primary h-4 w-4" />
                            )}
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>DELIVERY</SelectLabel>
                    {metricOptions
                      .filter((option) => option.group === "delivery")
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {selectedMetric === option.value && (
                              <Check className="text-primary h-4 w-4" />
                            )}
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Time Period Tabs */}
            <div className="bg-muted flex rounded-lg p-1">
              {(["Day", "Week", "Month"] as const).map((period) => (
                <Button
                  key={period}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className={cn(
                    "px-3 py-1 text-sm font-medium transition-colors",
                    selectedPeriod === period
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Chart Area */}
          <div className="lg:col-span-2">
            <PerformanceMetricDisplay
              selectedMetric={selectedMetric}
              currentValue={currentValue}
              comparisonValue={comparisonValue}
              tooltip={currentMetric?.tooltip ?? ""}
            />
            <PerformanceChart
              data={chartData}
              selectedMetric={selectedMetric}
            />
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4 lg:col-span-1">
            {getSampleStats().map((stat) => (
              <div key={v7()} className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  {stat.label}
                </span>
                <span className="text-foreground text-sm font-medium">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
