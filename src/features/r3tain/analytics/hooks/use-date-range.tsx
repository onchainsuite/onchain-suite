"use client";

import {
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subQuarters,
  subWeeks,
} from "date-fns";
import { useEffect, useState } from "react";

export function useDateRange(initialRange = "30") {
  const [selectedRange, setSelectedRange] = useState(initialRange);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    const today = new Date();
    let newStartDate: Date;
    let newEndDate = today;

    switch (selectedRange) {
      case "7":
        newStartDate = subDays(today, 7);
        break;
      case "30":
        newStartDate = subDays(today, 30);
        break;
      case "90":
        newStartDate = subDays(today, 90);
        break;
      case "365":
        newStartDate = subDays(today, 365);
        break;
      case "week":
        newStartDate = startOfWeek(subWeeks(today, 1));
        newEndDate = subDays(startOfWeek(today), 1);
        break;
      case "month":
        newStartDate = startOfMonth(subMonths(today, 1));
        newEndDate = subDays(startOfMonth(today), 1);
        break;
      case "quarter":
        newStartDate = startOfQuarter(subQuarters(today, 1));
        newEndDate = subDays(startOfQuarter(today), 1);
        break;
      case "qtd":
        newStartDate = startOfQuarter(today);
        break;
      case "ytd":
        newStartDate = startOfYear(today);
        break;
      case "custom":
        // For custom range, don't update dates automatically
        return;
      default:
        newStartDate = subDays(today, 30);
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }, [selectedRange]);

  return {
    selectedRange,
    setSelectedRange,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  };
}
