"use client";

import { useEffect, useState } from "react";

import {
  CustomTabs,
  CustomTabsContent,
  CustomTabsList,
  CustomTabsTrigger,
} from "@/components/ui/custom-tabs";

import { ConversionsCard } from "../components/conversions/conversions-card";
import { DashboardFilters } from "../components/dashboard-filters";
import { DashboardHeader } from "../components/dashboard-header";
import { DeliveryCard } from "../components/delivery/delivery-card";
import { DetailedMessagePerformance } from "../components/detailed-message-performance/detailed-message-performance";
import { IndividualMessagePerformance } from "../components/message-performance/individual-message-performance";
import { PerformanceMetrics } from "../components/performance/performance-metrics";
import { PerformanceOverTime } from "../components/performance/performance-over-time";
import { SampleDataAlert } from "../components/sample-data-alert";
import { useDateRange } from "@/r3tain/analytics/hooks";

export function MarketingDashboard() {
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [comparisonPeriod, setComparisonPeriod] = useState("30");

  const {
    selectedRange,
    setSelectedRange,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  } = useDateRange("30");

  // Update comparison period when date range changes
  useEffect(() => {
    // Calculate the appropriate comparison period based on date range
    let newComparisonPeriod: string;

    if (selectedRange === "custom") {
      // For custom ranges, use the number of days between start and end
      const days = Math.abs(
        Math.round(endDate.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      newComparisonPeriod = days.toString();
    } else {
      // For preset ranges, use the same value
      newComparisonPeriod = selectedRange;
    }

    // Only update if different to avoid infinite loops
    if (newComparisonPeriod !== comparisonPeriod) {
      setComparisonPeriod(newComparisonPeriod);
    }
  }, [
    selectedRange,
    startDate,
    endDate,
    comparisonPeriod,
    setComparisonPeriod,
  ]);

  const handleDatesChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardHeader />

      {/* Main Content */}
      <main className="bg-muted/20 scrollbar-thin overflow-auto">
        <div className="mx-auto max-w-[100vw] space-y-6 p-4 lg:max-w-6xl lg:p-6">
          <SampleDataAlert />

          <DashboardFilters
            selectedMessages={selectedMessages}
            onMessagesChange={setSelectedMessages}
            dateRange={selectedRange}
            onDateRangeChange={setSelectedRange}
            startDate={startDate}
            endDate={endDate}
            onDatesChange={handleDatesChange}
            comparisonPeriod={comparisonPeriod}
            onComparisonChange={setComparisonPeriod}
          />

          <CustomTabs defaultValue="performance">
            <CustomTabsList>
              <CustomTabsTrigger value="performance">
                Performance
              </CustomTabsTrigger>
              <CustomTabsTrigger value="compare">
                Compare message performance
              </CustomTabsTrigger>
            </CustomTabsList>

            <CustomTabsContent value="performance">
              <div className="space-y-6">
                <PerformanceMetrics
                  startDate={startDate}
                  endDate={endDate}
                  comparisonPeriod={comparisonPeriod}
                />

                <PerformanceOverTime
                  dateRange={selectedRange}
                  startDate={startDate}
                  endDate={endDate}
                  comparisonPeriod={comparisonPeriod}
                />

                <ConversionsCard
                  startDate={startDate}
                  endDate={endDate}
                  comparisonPeriod={comparisonPeriod}
                />

                <DeliveryCard
                  startDate={startDate}
                  endDate={endDate}
                  comparisonPeriod={comparisonPeriod}
                />
              </div>
            </CustomTabsContent>

            <CustomTabsContent value="compare">
              <div className="space-y-6">
                <IndividualMessagePerformance
                  startDate={startDate}
                  endDate={endDate}
                  comparisonPeriod={comparisonPeriod}
                />

                <DetailedMessagePerformance
                  startDate={startDate}
                  endDate={endDate}
                  comparisonPeriod={comparisonPeriod}
                />
              </div>
            </CustomTabsContent>
          </CustomTabs>
        </div>
      </main>
    </div>
  );
}
