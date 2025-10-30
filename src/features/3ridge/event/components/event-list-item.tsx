"use client";

import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventListItemProps {
  id: string;
  type: string;
  user: string;
  email: string;
  method: string;
  timestamp: string;
  status: "success" | "failed" | "pending";
  ip: string;
  onClick?: () => void;
}

export function EventListItem({
  type,
  user,
  email,
  method,
  timestamp,
  status,
  ip,
  onClick,
}: EventListItemProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-start gap-3 sm:items-center">
        <div
          className={`mt-1 h-2 w-2 shrink-0 rounded-full sm:mt-0 ${status === "success" ? "bg-teal-500" : "bg-red-500"}`}
        />

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-4">
          <Badge variant="outline" className="shrink-0 font-mono text-xs">
            {type}
          </Badge>
          <p className="truncate font-mono text-sm sm:min-w-[120px]">{user}</p>
          <p className="truncate text-sm text-muted-foreground sm:min-w-[180px]">
            {email}
          </p>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {method}
          </Badge>
          <p className="font-mono text-xs text-muted-foreground">{ip}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Badge
          variant={status === "success" ? "default" : "destructive"}
          className="shrink-0"
        >
          {status}
        </Badge>
        <span className="text-sm text-muted-foreground sm:min-w-[140px]">
          {timestamp}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className="shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
