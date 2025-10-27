"use client";

import { ExternalLink, HelpCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DateFilter } from "./date-filter";

type DateFilterType = "7" | "30" | "60" | "custom";

export function EmailPerformance() {
  const [dateFilter, setDateFilter] = useState<DateFilterType>("30");
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleApplyFilter = () => {
    // Handle filter application logic here
    console.log("Applying filter:", dateFilter, customDateRange);
  };

  return (
    <Card className="border-border bg-card border">
      <CardHeader className="flex flex-col pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">
            Email performance
          </CardTitle>
          <HelpCircle className="text-muted-foreground h-4 w-4" />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80"
          >
            See email analytics
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
          <DateFilter
            value={dateFilter}
            onChange={setDateFilter}
            customRange={customDateRange}
            onCustomRangeChange={setCustomDateRange}
            onApply={handleApplyFilter}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <p className="text-muted-foreground text-sm">
            Compared to last{" "}
            {dateFilter === "custom" ? "period" : `${dateFilter} days`}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Click rate</p>
            <p className="text-3xl font-bold">0%</p>
            <p className="text-muted-foreground text-xs">--</p>
          </div>
          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Open rate</p>
            <p className="text-3xl font-bold">0%</p>
            <p className="text-muted-foreground text-xs">--</p>
          </div>
          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">
              Clicks per unique opens
            </p>
            <p className="text-3xl font-bold">0%</p>
            <p className="text-muted-foreground text-xs">--</p>
          </div>
          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Unsubscribed</p>
            <p className="text-3xl font-bold">0</p>
            <p className="text-muted-foreground text-xs">--</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
