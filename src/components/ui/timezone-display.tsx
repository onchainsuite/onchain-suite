"use client";

import { Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import {
  getTimezoneDisplay,
  getUserTimezone,
  type TimezoneInfo,
} from "@/lib/timezone";

export function TimezoneDisplay() {
  const [info, setInfo] = useState<TimezoneInfo | null>(null);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tz = getUserTimezone();
    setInfo(getTimezoneDisplay(tz));
  }, []);

  useEffect(() => {
    if (!info) return;

    const updateTime = () => {
      try {
        const now = new Date();
        const timeString = new Intl.DateTimeFormat("en-US", {
          timeZone: info.timeZone,
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }).format(now);
        setTime(timeString);
      } catch (e) {
        // Fallback if timezone is invalid
        setTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [info]);

  if (!info) {
    return <Skeleton className="h-6 w-32" />;
  }

  return (
    <div
      className="flex items-center gap-2 text-sm text-muted-foreground"
      title={info.timeZone}
    >
      <Clock className="h-4 w-4" />
      <span className="font-medium text-foreground">{time}</span>
      <span className="font-medium">{info.short}</span>
      <span className="hidden sm:inline">({info.long})</span>
      <span className="text-xs opacity-70">{info.offset}</span>
    </div>
  );
}
