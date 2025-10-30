"use client";

import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LogEntryProps {
  level: "info" | "warning" | "error" | "debug";
  message: string;
  timestamp: string;
  source: string;
  onClick?: () => void;
}

export function LogEntry({
  level,
  message,
  timestamp,
  source,
  onClick,
}: LogEntryProps) {
  const levelColors = {
    info: "bg-blue-500",
    warning: "bg-secondary",
    error: "bg-destructive",
    debug: "bg-muted-foreground",
  };

  const levelVariants = {
    info: "default" as const,
    warning: "secondary" as const,
    error: "destructive" as const,
    debug: "outline" as const,
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-accent/50 transition-colors">
      <div className="flex flex-1 items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${levelColors[level]}`} />
        <Badge
          variant={levelVariants[level]}
          className="text-xs min-w-[70px] justify-center"
        >
          {level.toUpperCase()}
        </Badge>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          <p className="text-xs text-muted-foreground">{source}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground min-w-[140px] text-right">
          {timestamp}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClick}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
