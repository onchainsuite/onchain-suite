"use client";

import { TrendingDown } from "lucide-react";

interface ConversionsTotalRevenueProps {
  totalRevenue: number;
}

export function ConversionsTotalRevenue({
  totalRevenue,
}: ConversionsTotalRevenueProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <span className="text-primary border-primary border-b-2 border-dotted text-sm font-medium">
          Total revenue
        </span>
      </div>
      <div className="space-y-1">
        <div className="text-foreground text-3xl font-bold">
          ${totalRevenue.toLocaleString()}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <TrendingDown className="text-destructive h-4 w-4" />
          <span className="text-destructive font-medium">97.2%</span>
        </div>
      </div>
    </div>
  );
}
