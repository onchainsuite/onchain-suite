"use client";

import { format } from "date-fns";
import { Download, ExternalLink } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import {
  exportToCSV,
  generateDetailedMessageData,
} from "@/r3tain/analytics/utils";

interface DetailedMessagePerformanceProps {
  startDate: Date;
  endDate: Date;
  comparisonPeriod: string;
}

export function DetailedMessagePerformance({
  startDate,
  endDate,
}: DetailedMessagePerformanceProps) {
  // Generate sample data
  const data = useMemo(() => {
    return generateDetailedMessageData(33); // Generate 33 messages as shown in the image
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const dateRangeText = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  const handleExportCSV = () => {
    exportToCSV(
      data,
      `message-performance-${format(new Date(), "yyyy-MM-dd")}.csv`
    );
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-start justify-between sm:flex-row">
          <div>
            <CardTitle className="text-foreground text-xl">
              Detailed message performance
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {dateRangeText} • {data.length} messages •
              <span className="font-medium text-orange-600 dark:text-orange-400">
                {" "}
                Includes
              </span>{" "}
              Apple MPP
            </CardDescription>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Go to custom reports
            </Button>
            <Button
              onClick={handleExportCSV}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
