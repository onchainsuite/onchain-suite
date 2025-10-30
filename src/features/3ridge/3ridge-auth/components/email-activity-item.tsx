"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface EmailActivityItemProps {
  email: string;
  type: string;
  status: "delivered" | "failed";
  time: string;
}

export function EmailActivityItem({
  email,
  type,
  status,
  time,
}: EmailActivityItemProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 min-w-0">
        {status === "delivered" ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-500" />
        ) : (
          <XCircle className="h-5 w-5 shrink-0 text-destructive" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{email}</p>
          <p className="text-xs text-muted-foreground">{type}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <Badge
          variant={status === "delivered" ? "default" : "destructive"}
          className="shrink-0"
        >
          {status}
        </Badge>
        <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
          <Clock className="h-4 w-4" />
          {time}
        </div>
      </div>
    </div>
  );
}
