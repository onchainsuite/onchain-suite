"use client";

import React, { useEffect, useState } from "react";
import { getUserTimezone, getTimezoneDisplay, TimezoneInfo } from "@/lib/timezone";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";

export function TimezoneDisplay() {
  const [info, setInfo] = useState<TimezoneInfo | null>(null);

  useEffect(() => {
    const tz = getUserTimezone();
    setInfo(getTimezoneDisplay(tz));
  }, []);

  if (!info) {
    return <Skeleton className="h-6 w-32" />;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" title={info.timeZone}>
      <Clock className="h-4 w-4" />
      <span className="font-medium text-foreground">{info.short}</span>
      <span className="hidden sm:inline">({info.long})</span>
      <span className="text-xs opacity-70">{info.offset}</span>
    </div>
  );
}
