"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateFilter = "7" | "30" | "60" | "custom";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateFilterProps {
  value: DateFilter;
  onChange: (filter: DateFilter) => void;
  customRange: DateRange;
  onCustomRangeChange: (range: DateRange) => void;
  onApply?: () => void;
}

export function DateFilter({
  value,
  onChange,
  customRange,
  onCustomRangeChange,
  onApply,
}: DateFilterProps) {
  const [isCustomPopoverOpen, setIsCustomPopoverOpen] = useState(false);

  const getFilterLabel = () => {
    if (value === "custom" && customRange.from && customRange.to) {
      return `${customRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${customRange.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    }
    return value === "custom" ? "Custom range" : `${value} days`;
  };

  const handleCustomRangeChange = (
    field: "from" | "to",
    date: Date | undefined
  ) => {
    onCustomRangeChange({
      ...customRange,
      [field]: date,
    });
  };

  const handleCustomSelect = () => {
    onChange("custom");
    setIsCustomPopoverOpen(true);
  };

  const handleApplyCustomRange = () => {
    setIsCustomPopoverOpen(false);
    if (onApply) {
      onApply();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {getFilterLabel()}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onChange("7")}>
            7 days
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange("30")}>
            30 days
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChange("60")}>
            60 days
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCustomSelect}>
            Custom range
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom Date Range Popover */}
      <Popover open={isCustomPopoverOpen} onOpenChange={setIsCustomPopoverOpen}>
        <PopoverTrigger asChild>
          <div style={{ display: "none" }} />
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Custom Date Range</h4>
              <p className="text-muted-foreground text-sm">
                Select a custom date range for your data
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {customRange.from
                        ? customRange.from.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={customRange.from}
                      onSelect={(date) => handleCustomRangeChange("from", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {customRange.to
                        ? customRange.to.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={customRange.to}
                      onSelect={(date) => handleCustomRangeChange("to", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomPopoverOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!customRange.from || !customRange.to}
                onClick={handleApplyCustomRange}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
