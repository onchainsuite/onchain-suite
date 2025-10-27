"use client";

import { differenceInDays } from "date-fns";
import { Info } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DateRangePicker } from "./date-range-picker";
import { MessageFilterCombobox } from "./message-filter-combobox";

interface DashboardFiltersProps {
  selectedMessages: string[];
  onMessagesChange: (messages: string[]) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  startDate: Date;
  endDate: Date;
  onDatesChange: (start: Date, end: Date) => void;
  comparisonPeriod: string;
  onComparisonChange: (period: string) => void;
}

export function DashboardFilters({
  selectedMessages,
  onMessagesChange,
  dateRange,
  onDateRangeChange,
  startDate,
  endDate,
  onDatesChange,
  comparisonPeriod,
  onComparisonChange,
}: DashboardFiltersProps) {
  // Calculate comparison options based on selected date range
  const comparisonOptions = useMemo(() => {
    const options = [];

    // Calculate the period label based on date range selection
    let periodLabel = "";
    let periodValue = "";

    if (dateRange === "custom") {
      // For custom ranges, calculate the number of days between start and end
      const daysDifference = differenceInDays(endDate, startDate);
      periodLabel = `Last ${daysDifference} days`;
      periodValue = daysDifference.toString();
    } else {
      // For preset ranges, use the same period
      switch (dateRange) {
        case "7":
          periodLabel = "Last 7 days";
          periodValue = "7";
          break;
        case "30":
          periodLabel = "Last 30 days";
          periodValue = "30";
          break;
        case "90":
          periodLabel = "Last 90 days";
          periodValue = "90";
          break;
        case "365":
          periodLabel = "Last 365 days";
          periodValue = "365";
          break;
        case "week":
          periodLabel = "Last week";
          periodValue = "week";
          break;
        case "month":
          periodLabel = "Last month";
          periodValue = "month";
          break;
        case "quarter":
          periodLabel = "Last quarter";
          periodValue = "quarter";
          break;
        case "qtd":
          periodLabel = "Quarter-to-date";
          periodValue = "qtd";
          break;
        case "ytd":
          periodLabel = "Year-to-date";
          periodValue = "ytd";
          break;
        default:
          periodLabel = "Last 30 days";
          periodValue = "30";
      }
    }

    // Add the matching period option
    options.push({
      value: periodValue,
      label: periodLabel,
    });

    // Always add audience averages as second option
    options.push({
      value: "audience-averages",
      label: "Audience averages",
    });

    return options;
  }, [dateRange, startDate, endDate]);

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DateRangePicker
          selectedRange={dateRange}
          onRangeChange={onDateRangeChange}
          startDate={startDate}
          endDate={endDate}
          onDatesChange={onDatesChange}
        />

        <div className="space-y-2">
          <Label
            htmlFor="comparison"
            className="text-foreground text-sm font-medium"
          >
            Comparison
          </Label>
          <Select value={comparisonPeriod} onValueChange={onComparisonChange}>
            <SelectTrigger
              id="comparison"
              className="bg-background border-border/50 hover:border-border w-full transition-colors"
            >
              <SelectValue
                placeholder={comparisonOptions[0]?.label || "Select comparison"}
              />
            </SelectTrigger>
            <SelectContent>
              {comparisonOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <MessageFilterCombobox
          selectedMessages={selectedMessages}
          onSelectionChange={onMessagesChange}
        />
      </div>

      {/* Apple MPP Option */}
      <div className="bg-muted/30 border-border/50 flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
        <div className="flex items-start space-x-3 sm:items-center">
          <Checkbox
            id="apple-mpp"
            className="border-border/50 mt-0.5 sm:mt-0"
          />
          <div className="space-y-1">
            <Label
              htmlFor="apple-mpp"
              className="text-foreground text-sm leading-relaxed"
            >
              Exclude Apple MPP for more accurate open data.{" "}
              <Button
                variant="link"
                className="text-primary hover:text-primary/80 h-auto p-0 text-sm"
              >
                See why.
              </Button>
            </Label>
          </div>
          <Info className="text-muted-foreground h-4 w-4 shrink-0" />
        </div>
        <Badge
          variant="secondary"
          className="bg-success/10 text-success border-success/20 self-start sm:self-center"
        >
          New
        </Badge>
      </div>
    </div>
  );
}
