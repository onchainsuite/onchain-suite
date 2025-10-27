"use client";

import { ArrowUpRight, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 lg:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
          {/* Title Section */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
                Marketing dashboard
              </h1>
              <Badge
                variant="secondary"
                className="bg-info/10 text-info border-info/20 hover:bg-info/20 transition-colors"
              >
                Sample data
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Upgrade to Standard plan
            </Button>
            <Button
              variant="outline"
              className="border-border/50 hover:bg-accent/50 bg-transparent"
            >
              <Settings className="mr-2 h-4 w-4" />
              Attribution settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
