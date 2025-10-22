"use client";

import { eachMonthOfInterval, endOfYear, format, startOfYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

import { cn } from "@/lib/utils";

interface DatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  disabledDates?: (date: Date) => boolean;
  placeholder?: string;
}

export function DatePicker({
  date,
  setDate,
  disabledDates,
  placeholder = "Pick a date",
}: DatePickerProps) {
  // Initialize with current date if no date is provided
  const [month, setMonth] = React.useState<number>(
    date ? date.getMonth() : new Date().getMonth()
  );
  const [year, setYear] = React.useState<number>(
    date ? date.getFullYear() : new Date().getFullYear()
  );

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 41 }, (_, i) => currentYear - 20 + i);
  }, []);

  const months = React.useMemo(() => {
    return eachMonthOfInterval({
      start: startOfYear(new Date(year, 0, 1)),
      end: endOfYear(new Date(year, 0, 1)),
    });
  }, [year]);

  React.useEffect(() => {
    if (date) {
      setMonth(date.getMonth());
      setYear(date.getFullYear());
    }
  }, [date]);

  const handleYearChange = React.useCallback(
    (selectedYear: string) => {
      const newYear = parseInt(selectedYear, 10);
      setYear(newYear);
      if (date) {
        const newDate = new Date(date.getTime());
        newDate.setFullYear(newYear);
        setDate(newDate);
      }
    },
    [date, setDate]
  );

  const handleMonthChange = React.useCallback(
    (selectedMonth: string) => {
      const newMonth = parseInt(selectedMonth, 10);
      setMonth(newMonth);
      if (date) {
        const newDate = new Date(date.getTime());
        newDate.setMonth(newMonth);
        setDate(newDate);
      } else {
        const newDate = new Date(year, newMonth, 1);
        setDate(newDate);
      }
    },
    [date, setDate, year]
  );

  const handleSelect = React.useCallback(
    (newDate: Date | undefined) => {
      setDate(newDate);
    },
    [setDate]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex justify-between space-x-1 p-2">
          <Select value={year.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={month.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, index) => (
                <SelectItem key={uuidv4()} value={index.toString()}>
                  {format(m, "MMMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          month={new Date(year, month)}
          onMonthChange={(newMonth) => {
            setMonth(newMonth.getMonth());
            setYear(newMonth.getFullYear());
          }}
          disabled={disabledDates}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
