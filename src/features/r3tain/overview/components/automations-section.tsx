"use client";

import { ArrowUpRight, Copy, ExternalLink, HelpCircle } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DateFilter } from "./date-filter";

type DateFilterType = "7" | "30" | "60" | "custom";

const automationsData = [
  {
    name: "Landlord Roles 1",
    inProgress: 6,
    finished: 1642,
    opened: "40.3%",
    clicked: "1.73%",
    id: "1",
  },
  {
    name: "Mey Passport",
    inProgress: 0,
    finished: 118,
    opened: "82.2%",
    clicked: "44.92%",
    id: "2",
  },
  {
    name: "Landlord Roles 2",
    inProgress: 6,
    finished: 1659,
    opened: "40.38%",
    clicked: "1.68%",
    id: "3",
  },
];

export function AutomationsSection() {
  const [dateFilter, setDateFilter] = useState<DateFilterType>("7");
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
      <CardHeader className="flex flex-col justify-between pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Automations</CardTitle>
          <HelpCircle className="text-muted-foreground h-4 w-4" />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80"
          >
            See all automations
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
        <p className="text-muted-foreground mb-8 text-sm">
          Your active automations and their performance in the last{" "}
          {dateFilter === "custom" ? "period" : `${dateFilter} days`}
        </p>

        {/* Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Active automations</p>
            <p className="text-3xl font-bold">3</p>
          </div>
          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-1">
              <p className="text-muted-foreground text-sm">
                Subscribers in an automation
              </p>
              <HelpCircle className="text-muted-foreground h-3 w-3" />
            </div>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-1">
              <p className="text-muted-foreground text-sm">Average open rate</p>
              <HelpCircle className="text-muted-foreground h-3 w-3" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-3xl font-bold">38.31%</p>
              <Badge
                variant="outline"
                className="border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
              >
                -34.5%
              </Badge>
            </div>
          </div>
          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-1">
              <p className="text-muted-foreground text-sm">
                Average click rate
              </p>
              <HelpCircle className="text-muted-foreground h-3 w-3" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-3xl font-bold">1.95%</p>
              <Badge
                variant="outline"
                className="border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
              >
                -88.53%
              </Badge>
            </div>
          </div>
        </div>

        {/* Automations Table */}
        <div className="overflow-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[25%] font-semibold">
                    Active automations
                  </TableHead>
                  <TableHead className="w-[15%] text-center font-semibold">
                    In progress
                  </TableHead>
                  <TableHead className="w-[15%] text-center font-semibold">
                    Finished
                  </TableHead>
                  <TableHead className="w-[15%] text-center font-semibold">
                    Opened
                  </TableHead>
                  <TableHead className="w-[15%] text-center font-semibold">
                    Clicked
                  </TableHead>
                  <TableHead className="w-[15%] font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {automationsData.map((automation) => (
                  <TableRow key={automation.id} className="hover:bg-muted/30">
                    <TableCell className="py-4 font-medium">
                      {automation.name}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {automation.inProgress}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {automation.finished.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4 text-center font-medium">
                      {automation.opened}
                    </TableCell>
                    <TableCell className="py-4 text-center font-medium">
                      {automation.clicked}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Copy automation"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="View details"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
