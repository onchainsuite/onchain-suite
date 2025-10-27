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

import { ChartPagination, MetricDropdown, TimePeriodTabs } from "../shared";
import { DeliveryChart } from "./delivery-chart";
import { DeliveryDetailsSidebar } from "./delivery-details-sidebar";
import { DeliveryMetricDisplay } from "./delivery-metric-display";
import { type Period } from "@/r3tain/analytics/types";
import {
  type DeliveryMetric,
  generateDeliveryDailyData,
  generateDeliveryMonthlyData,
  generateDeliveryWeeklyData,
  getMetricLabel,
  getMetricValue,
} from "@/r3tain/analytics/utils";

const deliveryMetrics = [
  { value: "abuse-report-rate" as DeliveryMetric, label: "Abuse report rate" },
  { value: "bounce-rate" as DeliveryMetric, label: "Bounce rate" },
  { value: "delivery-rate" as DeliveryMetric, label: "Delivery rate" },
  { value: "unsubscribe-rate" as DeliveryMetric, label: "Unsubscribe rate" },
];

const groupedMetrics = {
  DELIVERY: deliveryMetrics,
};

interface DeliveryCardProps {
  startDate: Date;
  endDate: Date;
  comparisonPeriod: string;
}

export function DeliveryCard({
  startDate,
  endDate,
  comparisonPeriod,
}: DeliveryCardProps) {
  const [selectedMetric, setSelectedMetric] =
    useState<DeliveryMetric>("bounce-rate");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("Day");
  const [currentPage, setCurrentPage] = useState(0);
  const isMobile = useIsMobile();

  const allData = useMemo(() => {
    switch (selectedPeriod) {
      case "Day":
        return generateDeliveryDailyData(30);
      case "Week":
        return generateDeliveryWeeklyData(53);
      case "Month":
      default:
        return generateDeliveryMonthlyData(12);
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
    return displayData.map((item) => ({
      ...item,
      period: item.period,
      value: getMetricValue(item, selectedMetric),
      date: item.date,
    }));
  }, [displayData, selectedMetric]);

  const currentPageTotals = useMemo(() => {
    return displayData.reduce(
      (acc, item) => ({
        emailsSent: acc.emailsSent + item.emailsSent,
        deliveries: acc.deliveries + item.deliveries,
        bounces: acc.bounces + item.bounces,
        unsubscribed: acc.unsubscribed + item.unsubscribed,
        abuseReports: acc.abuseReports + item.abuseReports,
      }),
      {
        emailsSent: 0,
        deliveries: 0,
        bounces: 0,
        unsubscribed: 0,
        abuseReports: 0,
      }
    );
  }, [displayData]);

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

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    setCurrentPage(0);
  };

  return (
    <Card className="border-border/50 bg-card/50 shadow-sm backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div>
          <CardTitle className="text-foreground text-xl">Delivery</CardTitle>
          <CardDescription className="text-muted-foreground">
            {dateRangeText} • Compared to last {comparisonPeriod} days
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col justify-between sm:flex-row sm:items-center">
            <DeliveryMetricDisplay selectedMetric={selectedMetric} />
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <MetricDropdown
                selectedMetric={selectedMetric}
                onMetricChange={(value: string) =>
                  setSelectedMetric(value as DeliveryMetric)
                }
                options={deliveryMetrics}
                groupedOptions={groupedMetrics}
              />
              <TimePeriodTabs
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 lg:border-r-2">
              <DeliveryChart data={chartData} selectedMetric={selectedMetric} />

              <ChartPagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                legendLabel={getMetricLabel(selectedMetric)}
                legendColor="var(--chart-1)"
              />
            </div>

            <div className="lg:col-span-1">
              <DeliveryDetailsSidebar
                totals={currentPageTotals}
                selectedMetric={selectedMetric}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
