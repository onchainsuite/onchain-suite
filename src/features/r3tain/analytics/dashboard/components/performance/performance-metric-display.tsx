"use client";

import { Info, TrendingDown, TrendingUp } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  getPerformanceMetricLabel,
  isPercentageMetric,
  type PerformanceMetric,
} from "@/r3tain/analytics/utils";

interface PerformanceMetricDisplayProps {
  selectedMetric: PerformanceMetric;
  currentValue: number;
  comparisonValue: number;
  tooltip: string;
}

export function PerformanceMetricDisplay({
  selectedMetric,
  currentValue,
  comparisonValue,
  tooltip,
}: PerformanceMetricDisplayProps) {
  const isPercentage = isPercentageMetric(selectedMetric);
  const percentageChange =
    comparisonValue !== 0
      ? ((currentValue - comparisonValue) / comparisonValue) * 100
      : 0;
  const isPositive = percentageChange > 0;
  const isNegative = percentageChange < 0;

  const formatValue = (value: number) => {
    if (isPercentage) {
      return `${value.toFixed(1)}%`;
    }
    if (selectedMetric === "clicks-per-unique-opens") {
      return value.toFixed(1);
    }
    return value.toLocaleString();
  };

  const formatComparison = () => {
    if (Math.abs(percentageChange) < 0.1) {
      return "No change";
    }
    return `${Math.abs(percentageChange).toFixed(1)}%`;
  };

  return (
    <div className="space-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex cursor-help items-center gap-1">
              <span className="text-primary border-primary border-b-2 border-dotted text-sm font-medium">
                {getPerformanceMetricLabel(selectedMetric)}
              </span>
              <Info className="text-muted-foreground h-3 w-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="space-y-1">
        <div className="text-foreground text-3xl font-bold">
          {formatValue(currentValue)}
        </div>
        <div className="flex items-center gap-1 text-sm">
          {isPositive && (
            <>
              <TrendingUp className="text-success h-4 w-4" />
              <span className="text-success font-medium">
                {formatComparison()}
              </span>
            </>
          )}
          {isNegative && (
            <>
              <TrendingDown className="text-destructive h-4 w-4" />
              <span className="text-destructive font-medium">
                {formatComparison()}
              </span>
            </>
          )}
          {!isPositive && !isNegative && (
            <span className="text-muted-foreground">No change</span>
          )}
        </div>
      </div>
    </div>
  );
}
