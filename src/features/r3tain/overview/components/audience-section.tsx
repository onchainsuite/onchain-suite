"use client";

import { Copy, ExternalLink, HelpCircle, TrendingUp } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DateFilter } from "./date-filter";

type DateFilterType = "7" | "30" | "60" | "custom";

const recentCampaigns = [
  {
    name: "Big Changes Ahead: DEV Update...",
    type: "Regular email",
    recipients: 3666,
    id: "1",
  },
  {
    name: "Big Changes Ahead: DEV Update...",
    type: "Regular email",
    recipients: 406,
    id: "2",
  },
  {
    name: "DEV Update 445 (Not Engaged)...",
    type: "Regular email",
    recipients: 51022,
    id: "3",
  },
  {
    name: "DEV Update 445 (Engaged subs)...",
    type: "Regular email",
    recipients: 2498,
    id: "4",
  },
  {
    name: "DEV Update 445",
    type: "Regular email",
    recipients: 356,
    id: "5",
  },
];

export function AudienceSection() {
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
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
      {/* Audience Card */}
      <Card className="border-border bg-card border">
        <CardHeader className="flex flex-col justify-between pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">Audience</CardTitle>
            <HelpCircle className="text-muted-foreground h-4 w-4" />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80"
            >
              See audience analytics
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
          <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Current contacts</p>
            <p className="text-3xl font-bold">23,329</p>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-600">0.01%</span>
              <span className="text-muted-foreground">
                Compared to last{" "}
                {dateFilter === "custom" ? "period" : `${dateFilter} days`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Campaign Performance */}
      <Card className="border-border bg-card border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              Recent campaign performance
            </CardTitle>
            <HelpCircle className="text-muted-foreground h-4 w-4" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80"
          >
            See all campaigns
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <div className="min-w-[500px]">
              <div className="text-muted-foreground border-border mb-4 grid grid-cols-4 gap-4 border-b pb-3 text-sm font-medium">
                <span>Name</span>
                <span>Type</span>
                <span>Recipients</span>
                <span />
              </div>
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="hover:bg-muted/20 -mx-2 grid grid-cols-4 items-center gap-4 rounded-md px-2 py-2 text-sm"
                  >
                    <span className="text-card-foreground truncate font-medium">
                      {campaign.name}
                    </span>
                    <Badge variant="outline" className="w-fit">
                      {campaign.type}
                    </Badge>
                    <span className="text-muted-foreground">
                      {campaign.recipients.toLocaleString()}
                    </span>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Copy campaign"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
