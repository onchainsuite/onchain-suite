"use client";

import { cn } from "@/lib/utils";

import type { CampaignStatus } from "../../types/campaign";

// One entry per real campaign status (Campaign["status"]), so the legend can
// filter everything the calendar can actually show.
const LEGEND_STATUSES: Array<{
  status: CampaignStatus;
  label: string;
  dotClass: string;
}> = [
  { status: "sent", label: "Sent", dotClass: "bg-green-500" },
  { status: "sending", label: "Sending", dotClass: "bg-sky-500" },
  { status: "scheduled", label: "Scheduled", dotClass: "bg-blue-500" },
  { status: "draft", label: "Draft", dotClass: "bg-yellow-500" },
  { status: "paused", label: "Paused", dotClass: "bg-gray-400" },
  { status: "failed", label: "Failed", dotClass: "bg-red-500" },
];

interface CalendarLegendProps {
  /** Statuses currently toggled on; empty means "show all". */
  activeStatuses: Set<CampaignStatus>;
  onToggleStatus: (status: CampaignStatus) => void;
}

/**
 * Status legend that doubles as a filter: clicking a status toggles it on/off
 * for the calendar grid. No active statuses = show everything.
 */
export function CalendarLegend({
  activeStatuses,
  onToggleStatus,
}: CalendarLegendProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
      <span className="text-xs sm:text-sm font-medium text-foreground">
        Status:
      </span>
      {LEGEND_STATUSES.map(({ status, label, dotClass }) => {
        const isActive = activeStatuses.has(status);
        return (
          <button
            key={status}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggleStatus(status)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors sm:gap-2",
              isActive
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <span
              aria-hidden="true"
              className={cn("h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3", dotClass)}
            />
            <span className="text-xs sm:text-sm">{label}</span>
          </button>
        );
      })}
      {activeStatuses.size > 0 ? (
        <button
          type="button"
          onClick={() => {
            for (const { status } of LEGEND_STATUSES) {
              if (activeStatuses.has(status)) onToggleStatus(status);
            }
          }}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
