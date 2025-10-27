"use client";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface TimePeriodTabsProps {
  selectedPeriod: "Day" | "Week" | "Month";
  onPeriodChange: (period: "Day" | "Week" | "Month") => void;
}

export function TimePeriodTabs({
  selectedPeriod,
  onPeriodChange,
}: TimePeriodTabsProps) {
  return (
    <div className="bg-muted flex w-max rounded-lg p-1">
      {(["Day", "Week", "Month"] as const).map((period) => (
        <Button
          key={period}
          variant="ghost"
          size="sm"
          onClick={() => onPeriodChange(period)}
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
  );
}
