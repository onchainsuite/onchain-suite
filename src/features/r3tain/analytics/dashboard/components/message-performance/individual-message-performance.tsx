"use client";

import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useIsMobile } from "@/hooks/client";

import { MessagePerformanceChart } from "./message-performance-chart";
import { MessagePerformanceMetricSelector } from "./message-performance-metric-selector";
import {
  generateMessagePerformanceData,
  type MessageMetric,
} from "@/r3tain/analytics/utils";

interface IndividualMessagePerformanceProps {
  startDate: Date;
  endDate: Date;
  comparisonPeriod: string;
}

export function IndividualMessagePerformance({
  startDate,
  endDate,
  comparisonPeriod,
}: IndividualMessagePerformanceProps) {
  const [selectedMetric, setSelectedMetric] =
    useState<MessageMetric>("open-rate");
  const [currentPage, setCurrentPage] = useState(0);
  const isMobile = useIsMobile();

  // Generate sample data
  const allData = useMemo(() => {
    return generateMessagePerformanceData(31);
  }, []);

  // Adjust items per page based on screen size
  const itemsPerPage = isMobile ? 6 : 15; // 6 for mobile, 15 for desktop
  const totalItems = allData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const displayData = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    return allData.slice(startIndex, endIndex);
  }, [allData, currentPage, itemsPerPage, totalItems]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const dateRangeText = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));
  };

  return (
    <Card className="border-border/50 bg-card/50 shadow-sm backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <CardTitle className="text-foreground text-xl">
              Individual message performance
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {dateRangeText} • Compared to last {comparisonPeriod} days •
              <span className="text-warning font-medium"> Includes</span> Apple
              MPP
            </CardDescription>
          </div>
          <MessagePerformanceMetricSelector
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <MessagePerformanceChart
            data={displayData}
            selectedMetric={selectedMetric}
          />

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: "#8b5cf6" }}
                />
                <span className="text-muted-foreground">Email</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: "#22c55e" }}
                />
                <span className="text-muted-foreground">SMS</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
