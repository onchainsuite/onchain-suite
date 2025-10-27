"use client";

import { Edit } from "lucide-react";
import { useState } from "react";
import { v7 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CustomizeMetricsModal } from "./customize-metrics-modal";
import { metricOptions } from "./metric-options";

interface PerformanceMetricsProps {
  startDate: Date;
  endDate: Date;
  comparisonPeriod: string;
}

export function PerformanceMetrics({
  startDate,
  endDate,
  comparisonPeriod,
}: PerformanceMetricsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState([
    "total-sends",
    "open-rate",
    "click-rate",
    "unsubscribe-rate",
  ]);

  const getMetricOption = (value: string) => {
    return metricOptions.find((option) => option.value === value);
  };

  const handleSaveMetrics = (newMetrics: string[]) => {
    setCurrentMetrics(newMetrics);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const dateRangeText = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  return (
    <>
      <Card className="border-border/50 bg-card/50 shadow-sm backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-foreground flex items-center gap-2 text-xl">
                Monitor performance
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent/50 h-6 w-6"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                {dateRangeText} • Compared to last {comparisonPeriod} days •
                <span className="text-warning font-medium"> Includes</span>{" "}
                Apple MPP
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {currentMetrics.map((metricValue) => {
              const metric = getMetricOption(metricValue);
              if (!metric) return null;

              return (
                <div
                  key={v7()}
                  className="bg-muted/30 border-border/30 space-y-3 rounded-lg border p-4"
                >
                  <div className="text-muted-foreground flex items-center gap-2">
                    <metric.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-foreground text-2xl font-bold lg:text-3xl">
                      {metricValue.includes("rate") ? "0%" : "0"}
                    </div>
                    <div className="text-muted-foreground text-sm">--</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <CustomizeMetricsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentMetrics={currentMetrics}
        onSave={handleSaveMetrics}
      />
    </>
  );
}
