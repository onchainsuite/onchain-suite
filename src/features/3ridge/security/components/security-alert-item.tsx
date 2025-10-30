"use client";

import { Badge } from "@/components/ui/badge";

interface SecurityAlertItemProps {
  type: string;
  message: string;
  time: string;
  severity: "high" | "medium" | "low";
}

export function SecurityAlertItem({
  message,
  time,
  severity,
}: SecurityAlertItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div
        className={`mt-0.5 h-2 w-2 rounded-full ${
          severity === "high"
            ? "bg-destructive"
            : severity === "medium"
              ? "bg-secondary"
              : "bg-primary"
        } animate-pulse`}
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <Badge
        variant={severity === "high" ? "destructive" : "secondary"}
        className="text-xs"
      >
        {severity}
      </Badge>
    </div>
  );
}
