"use client";

import { Badge } from "@/components/ui/badge";

interface CircuitVersionCardProps {
  name: string;
  status: "active" | "pending";
  updated: string;
}

export function CircuitVersionCard({
  name,
  status,
  updated,
}: CircuitVersionCardProps) {
  return (
    <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm">{name}</h4>
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className="text-xs"
        >
          {status}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{updated}</p>
    </div>
  );
}
