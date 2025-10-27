"use client";

import { format } from "date-fns";
import { Calendar, Check, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dateRangeOptions = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last 365 days" },
  { value: "week", label: "Last week" },
  { value: "month", label: "Last month" },
  { value: "quarter", label: "Last quarter" },
  { value: "qtd", label: "Quarter-to-date" },
  { value: "ytd", label: "Year-to-date" },
  { value: "custom", label: "Custom" },
];

interface DateRangePickerProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  startDate: Date;
  endDate: Date;
  onDatesChange: (start: Date, end: Date) => void;
}

export function DateRangePicker({
  selectedRange,
  onRangeChange,
  startDate,
  endDate,
  onDatesChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  // Get the display label for the selected range
  const getDisplayLabel = () => {
    if (selectedRange === "custom") {
      return `${format(startDate, "MMMM d, yyyy")} - ${format(endDate, "MMMM d, yyyy")}`;
    }

    const option = dateRangeOptions.find(
      (option) => option.value === selectedRange
    );
    return option?.label ?? "Last 30 days";
  };

  const handleRangeChange = (value: string) => {
    onRangeChange(value);
    if (value === "custom") {
      // Keep the modal open for custom range selection
      return;
    }
    setIsOpen(false);
  };

  const handleApply = () => {
    if (selectedRange === "custom") {
      // Set the range to custom to trigger the comparison update
      onRangeChange("custom");
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor="date-range"
        className="text-foreground text-sm font-medium"
      >
        Date range
      </Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="bg-background border-primary text-foreground hover:bg-accent w-full justify-between border-2"
          >
            <span className="truncate">{getDisplayLabel()}</span>
            <Calendar className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-foreground font-medium">Date range</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">
                Date range
              </Label>
              <Select value={selectedRange} onValueChange={handleRangeChange}>
                <SelectTrigger className="border-primary border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRangeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      {selectedRange === option.value && (
                        <Check className="text-primary h-4 w-4" />
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRange === "custom" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground text-sm font-medium">
                      Start date
                    </Label>
                    <Popover
                      open={startCalendarOpen}
                      onOpenChange={setStartCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent text-left font-normal"
                        >
                          {format(startDate, "MM-dd-yyyy")}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            if (date) {
                              onDatesChange(date, endDate);
                              setStartCalendarOpen(false);
                            }
                          }}
                          disabled={(date) =>
                            date > endDate || date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground text-sm font-medium">
                      End date
                    </Label>
                    <Popover
                      open={endCalendarOpen}
                      onOpenChange={setEndCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent text-left font-normal"
                        >
                          {format(endDate, "MM-dd-yyyy")}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            if (date) {
                              onDatesChange(startDate, date);
                              setEndCalendarOpen(false);
                            }
                          }}
                          disabled={(date) =>
                            date < startDate || date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={handleApply}
                  >
                    Apply
                  </Button>
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
