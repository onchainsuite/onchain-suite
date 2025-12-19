import { Circle } from "lucide-react";

import { Badge } from "@/ui/badge";

import { cn } from "@/lib/utils";

import type { Campaign } from "../../../campaigns/types";
import {
  getCampaignStatusColor,
  getCampaignTypeColor,
} from "../../../campaigns/utils/campaign";

interface CalendarDayCellProps {
  day: number | null;
  campaigns: Campaign[];
  isToday: boolean;
  onClick: () => void;
}

export function CalendarDayCell({
  day,
  campaigns,
  isToday,
  onClick,
}: CalendarDayCellProps) {
  const hasEvents = campaigns.length > 0;

  if (!day) {
    return (
      <div className="min-h-[60px] sm:min-h-[100px] rounded-lg sm:rounded-xl opacity-0 pointer-events-none" />
    );
  }

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      className={cn(
        "min-h-[60px] sm:min-h-[100px] rounded-lg sm:rounded-xl border border-border bg-background/50 p-1 sm:p-2 transition-all duration-300",
        "hover:bg-muted/50 hover:shadow-md cursor-pointer",
        isToday &&
          "border-primary bg-primary/5 ring-1 sm:ring-2 ring-primary/20"
      )}
    >
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <span
          className={cn(
            "text-xs sm:text-sm font-medium",
            isToday ? "text-primary font-bold" : "text-foreground"
          )}
        >
          {day}
        </span>
        {hasEvents && (
          <Badge
            variant="secondary"
            className="h-4 sm:h-5 min-w-4 sm:min-w-5 rounded-full p-0 flex items-center justify-center text-[10px] sm:text-xs"
          >
            {campaigns.length}
          </Badge>
        )}
      </div>
      <div className="space-y-0.5 sm:space-y-1">
        {/* Mobile: Show dots */}
        <div className="flex gap-1 sm:hidden">
          {campaigns.slice(0, 3).map((campaign) => (
            <Circle
              key={campaign.id}
              className={cn(
                "h-2 w-2 fill-current",
                getCampaignStatusColor(campaign.status)
              )}
            />
          ))}
        </div>

        {/* Desktop: Show campaign cards */}
        <div className="hidden sm:block space-y-1">
          {campaigns.slice(0, 2).map((campaign) => (
            <div
              key={campaign.id}
              className="group relative rounded-lg bg-muted/80 p-1.5 text-xs transition-all duration-300 hover:bg-muted"
            >
              <div className="flex items-center gap-1">
                <Circle
                  className={cn(
                    "h-2 w-2 fill-current shrink-0",
                    getCampaignStatusColor(campaign.status)
                  )}
                />
                <span className="truncate font-medium text-foreground">
                  {campaign.name}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-1">
                <Badge
                  variant="outline"
                  className={cn(
                    "h-4 px-1 text-[10px] border-0",
                    getCampaignTypeColor(campaign.type)
                  )}
                >
                  {campaign.type}
                </Badge>
              </div>
            </div>
          ))}
          {campaigns.length > 2 && (
            <div className="text-center text-xs text-muted-foreground font-medium py-1">
              +{campaigns.length - 2} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
