"use client";

import { TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { GrowthData } from "@/r3tain/community/types";

interface RecentGrowthProps {
  growth: GrowthData;
  onAddPopupForm: () => void;
  onCreateLandingPage: () => void;
  onConnectSite: () => void;
}

export function RecentGrowth({
  growth,
  onAddPopupForm,
  onCreateLandingPage,
  onConnectSite,
}: RecentGrowthProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <TrendingUp className="h-4 w-4" />
          Recent growth
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          New subscribers added to this community in the last 30 days.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="py-4 text-center">
          <p className="text-muted-foreground mb-4 text-sm">
            No subscribers were added to this community in the last 30 days.
          </p>

          <div className="mb-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{growth.newSubscribers}</div>
              <div className="text-muted-foreground text-xs">
                New Subscribers
              </div>
              <div className="text-muted-foreground text-xs">
                From {formatDate(growth.dateRange.from)} to{" "}
                {formatDate(growth.dateRange.to)}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{growth.subscribed}</div>
              <div className="text-muted-foreground text-xs">Subscribed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{growth.nonSubscribed}</div>
              <div className="text-muted-foreground text-xs">
                Non-Subscribed
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            <div className="flex-1">
              <Button
                variant="link"
                className="h-auto p-0 font-normal text-blue-600"
                onClick={onAddPopupForm}
              >
                Add a pop-up form
              </Button>
              <span className="text-muted-foreground ml-1 text-sm">
                to your site and collect subscribers up to 50% faster.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            <div className="flex-1">
              <Button
                variant="link"
                className="h-auto p-0 font-normal text-blue-600"
                onClick={onCreateLandingPage}
              >
                Create a landing page
              </Button>
              <span className="text-muted-foreground ml-1 text-sm">
                to collect new subscribers or promote your product.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            <div className="flex-1">
              <Button
                variant="link"
                className="h-auto p-0 font-normal text-blue-600"
                onClick={onConnectSite}
              >
                Connect your site
              </Button>
              <span className="text-muted-foreground ml-1 text-sm">
                to sync your data and send more targeted campaigns to your
                customers.
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
