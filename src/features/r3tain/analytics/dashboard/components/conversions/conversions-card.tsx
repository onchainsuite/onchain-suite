"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CustomTabs,
  CustomTabsContent,
  CustomTabsList,
  CustomTabsTrigger,
} from "@/components/ui/custom-tabs";

import { ConversionFunnel } from "../funnel";
import { ConversionsOverTime } from "./conversions-over-time";

interface ConversionsCardProps {
  startDate: Date;
  endDate: Date;
  comparisonPeriod: string;
}

export function ConversionsCard({
  startDate,
  endDate,
  comparisonPeriod,
}: ConversionsCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const dateRangeText = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div>
          <CardTitle className="text-foreground text-xl">Conversions</CardTitle>
          <CardDescription className="text-muted-foreground">
            {dateRangeText} • Compared to last {comparisonPeriod} days •
            <span className="font-medium text-orange-600 dark:text-orange-400">
              {" "}
              Includes
            </span>{" "}
            Apple MPP
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <CustomTabs defaultValue="conversions-over-time">
          <CustomTabsList>
            <CustomTabsTrigger value="conversion-funnel">
              Conversion funnel
            </CustomTabsTrigger>
            <CustomTabsTrigger value="conversions-over-time">
              Conversions over time
            </CustomTabsTrigger>
          </CustomTabsList>

          <CustomTabsContent value="conversion-funnel">
            <ConversionFunnel />
          </CustomTabsContent>

          <CustomTabsContent value="conversions-over-time">
            <ConversionsOverTime />
          </CustomTabsContent>
        </CustomTabs>
      </CardContent>
    </Card>
  );
}
