"use client";

import { Activity, Download, Filter, Pause, Play, Zap } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";

import {
  EventTypeDistribution,
  LiveEventItem,
} from "@/3ridge/event/components";
import { liveEvents } from "@/3ridge/event/data";

export function LiveEventsPage() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Live Events
          </h1>
          <p className="text-pretty text-muted-foreground">
            Real-time event stream from your authentication system
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant={isPaused ? "default" : "outline"}
            className="gap-2"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Events/min"
          value="847"
          icon={Activity}
          trend={{ value: "↑ 12%", label: "from avg" }}
          borderColor="border-primary/20"
          bgGradient="bg-gradient-to-br from-primary/5 to-transparent"
        />
        <StatCard
          title="Success Rate"
          value="94.2%"
          description="Last 5 minutes"
          icon={Zap}
          iconColor="text-teal-500"
          borderColor="border-teal-500/20"
          bgGradient="bg-gradient-to-br from-teal-500/5 to-transparent"
        />
        <StatCard
          title="Active Users"
          value="1,234"
          description="Currently online"
          icon={Activity}
          iconColor="text-violet-500"
          borderColor="border-violet-500/20"
          bgGradient="bg-gradient-to-br from-violet-500/5 to-transparent"
        />
        <StatCard
          title="Failed Events"
          value="49"
          description="Last 5 minutes"
          icon={Activity}
          iconColor="text-red-500"
          borderColor="border-red-500/20"
          bgGradient="bg-gradient-to-br from-red-500/5 to-transparent"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2">
                <div className="relative flex h-3 w-3 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-500" />
                </div>
                Live Event Stream
              </CardTitle>
              <CardDescription>Real-time events as they happen</CardDescription>
            </div>
            <Input placeholder="Search events..." className="w-full sm:w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {liveEvents.map((event) => (
              <LiveEventItem key={event.id} {...event} />
            ))}
          </div>
        </CardContent>
      </Card>

      <EventTypeDistribution />
    </div>
  );
}
