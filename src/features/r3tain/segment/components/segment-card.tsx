"use client";

import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Segment } from "@/r3tain/segment/types";

interface SegmentCardProps {
  segment: Segment;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function SegmentCard({
  segment,
  showDetails = false,
  size = "md",
  onClick,
}: SegmentCardProps) {
  const sizeClasses = {
    sm: "p-4",
    md: "p-4",
    lg: "p-6",
  };

  const iconSizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`group border-border bg-card hover:bg-accent/50 relative cursor-pointer rounded-lg border transition-all duration-200 hover:shadow-md ${sizeClasses[size]}`}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      tabIndex={0}
      role="button"
    >
      <div className="flex items-start gap-3">
        <div
          className={`bg-muted group-hover:bg-primary/10 flex items-center justify-center rounded-lg transition-colors ${iconSizeClasses[size]}`}
        >
          {segment.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3
              className={`leading-tight font-medium ${
                size === "lg" ? "font-semibold" : "text-sm"
              }`}
            >
              {segment.name}
            </h3>
            <Info className="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p
            className={`text-muted-foreground leading-relaxed ${
              size === "lg" ? "mb-4 text-sm" : "text-xs"
            }`}
          >
            {segment.description}
          </p>
          {showDetails && segment.id === "new-subscribers" && (
            <Button
              variant="link"
              className={`text-primary mt-2 h-auto p-0 ${
                size === "lg" ? "text-sm" : "text-xs"
              }`}
            >
              View segment details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
