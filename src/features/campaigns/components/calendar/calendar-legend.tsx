import { Circle } from "lucide-react";

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
      <span className="text-xs sm:text-sm font-medium text-foreground">
        Status:
      </span>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Circle className="h-2.5 sm:h-3 w-2.5 sm:w-3 fill-green-500 text-green-500" />
        <span className="text-xs sm:text-sm text-muted-foreground">Sent</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Circle className="h-2.5 sm:h-3 w-2.5 sm:w-3 fill-blue-500 text-blue-500" />
        <span className="text-xs sm:text-sm text-muted-foreground">
          Scheduled
        </span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Circle className="h-2.5 sm:h-3 w-2.5 sm:w-3 fill-yellow-500 text-yellow-500" />
        <span className="text-xs sm:text-sm text-muted-foreground">Draft</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Circle className="h-2.5 sm:h-3 w-2.5 sm:w-3 fill-red-500 text-red-500" />
        <span className="text-xs sm:text-sm text-muted-foreground">Failed</span>
      </div>
    </div>
  );
}
