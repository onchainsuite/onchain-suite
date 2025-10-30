"use client";

import { Calendar, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";

import { EventListItem, EventSearchFilters } from "@/3ridge/event/components";
import { historicalEvents } from "@/3ridge/event/data";

export function EventHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Event History
          </h1>
          <p className="text-pretty text-muted-foreground">
            Search and analyze historical authentication events
          </p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <EventSearchFilters />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Total Events"
          value="1.2M"
          description="Last 30 days"
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Successful"
          value="1.1M"
          description="92.3% success rate"
          icon={Calendar}
          variant="teal"
        />
        <StatCard
          title="Failed"
          value="92K"
          description="7.7% failure rate"
          icon={Calendar}
          variant="red"
        />
        <StatCard
          title="Unique Users"
          value="45.2K"
          description="Active users"
          icon={Calendar}
          variant="violet"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Log</CardTitle>
          <CardDescription>Detailed historical event records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {historicalEvents.map((event) => (
              <EventListItem key={event.id} {...event} />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1-5 of 1,234,567 events
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
