"use client";

import { useMemo, useState } from "react";

import { useIsMobile } from "@/hooks/client";

import { ConversionsChart } from "./conversions-chart";
import { ConversionsFilters } from "./conversions-filters";
import { ConversionsRevenueBreakdown } from "./conversions-revenue-breakdown";
import { ConversionsTotalRevenue } from "./conversions-total-revenue";
import type { Channel, Period } from "@/r3tain/analytics/types";
import {
  generateDailyData,
  generateMonthlyData,
  generateWeeklyData,
} from "@/r3tain/analytics/utils";

export function ConversionsOverTime() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("Month");
  const [currentPage, setCurrentPage] = useState(0);
  const isMobile = useIsMobile();

  const allData = useMemo(() => {
    switch (selectedPeriod) {
      case "Day":
        return generateDailyData(364);
      case "Week":
        return generateWeeklyData(53);
      case "Month":
      default:
        return generateMonthlyData(12);
    }
  }, [selectedPeriod]);

  // Adjust items per page based on screen size and period
  const itemsPerPage = useMemo(() => {
    if (isMobile) {
      switch (selectedPeriod) {
        case "Day":
        case "Week":
          return 7;
        case "Month":
          return 6;
        default:
          return 6;
      }
    }
    return 16; // Desktop default
  }, [isMobile, selectedPeriod]);

  const totalItems = allData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const displayData = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    return allData.slice(startIndex, endIndex);
  }, [allData, currentPage, itemsPerPage, totalItems]);

  const chartData = useMemo(() => {
    return displayData.map((item) => {
      switch (selectedChannel) {
        case "email":
          return { ...item, sms: 0, total: item.email };
        case "sms":
          return { ...item, email: 0, total: item.sms };
        default:
          return item;
      }
    });
  }, [displayData, selectedChannel]);

  const totalRevenue = allData.reduce((sum, item) => {
    switch (selectedChannel) {
      case "email":
        return sum + item.email;
      case "sms":
        return sum + item.sms;
      default:
        return sum + item.total;
    }
  }, 0);

  const smsRevenue = allData.reduce((sum, item) => sum + item.sms, 0);
  const emailRevenue = allData.reduce((sum, item) => sum + item.email, 0);
  const smsPercentage =
    totalRevenue > 0
      ? Math.round((smsRevenue / (smsRevenue + emailRevenue)) * 100)
      : 0;
  const emailPercentage =
    totalRevenue > 0
      ? Math.round((emailRevenue / (smsRevenue + emailRevenue)) * 100)
      : 0;

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));
  };

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    setCurrentPage(0);
  };

  const legendItems = [];
  if (selectedChannel !== "sms") {
    legendItems.push({ label: "Email", color: "var(--chart-1)" });
  }
  if (selectedChannel !== "email") {
    legendItems.push({ label: "SMS", color: "var(--chart-2)" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse justify-between sm:flex-row sm:items-center">
        <ConversionsTotalRevenue totalRevenue={totalRevenue} />
        <ConversionsFilters
          selectedChannel={selectedChannel}
          onChannelChange={setSelectedChannel}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 lg:border-r-2">
          <ConversionsChart
            data={chartData}
            selectedChannel={selectedChannel}
          />

          <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center lg:pr-4">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                {currentPage * itemsPerPage + 1} -{" "}
                {Math.min((currentPage + 1) * itemsPerPage, totalItems)} of{" "}
                {totalItems}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className="text-muted-foreground hover:text-foreground rounded px-2 py-1 text-sm transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                  className="text-primary hover:text-primary/80 rounded px-2 py-1 text-sm transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              {legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ConversionsRevenueBreakdown
          selectedChannel={selectedChannel}
          emailRevenue={emailRevenue}
          smsRevenue={smsRevenue}
          emailPercentage={emailPercentage}
          smsPercentage={smsPercentage}
        />
      </div>
    </div>
  );
}
