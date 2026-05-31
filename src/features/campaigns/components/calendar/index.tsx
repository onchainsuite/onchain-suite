"use client";

import { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { getZonedDateTimeParts, zonedWallTimeToUtcDate } from "@/lib/timezone";

import type { Campaign } from "../../../campaigns/types";
import {
  generateCalendarDays,
  getCampaignsForDate,
  isToday,
  MONTH_NAMES,
  WEEK_DAYS,
  WEEK_DAYS_MOBILE,
} from "../../../campaigns/utils";
import { CalendarDayCell } from "./calendar-day-cell";
import { CalendarHeader } from "./calendar-header";
import { CalendarLegend } from "./calendar-legend";
import { CampaignDetailModal } from "./campaign-detail-modal";
import { useActiveTimezone } from "@/shared/hooks/client/use-timezones";

interface CampaignsCalendarProps {
  campaigns: Campaign[];
}

export function CampaignsCalendar({ campaigns }: CampaignsCalendarProps) {
  const { timezone } = useActiveTimezone();

  const initialMonth = useMemo(() => {
    const first = campaigns.find((c) => c.scheduledFor)?.scheduledFor;
    const base = first ? new Date(first) : new Date();
    const parts = getZonedDateTimeParts(base, timezone);
    return { year: parts.year, month: parts.month - 1 };
  }, [campaigns, timezone]);

  const [currentMonth, setCurrentMonth] = useState<{
    year: number;
    month: number;
  }>(initialMonth);

  useEffect(() => {
    setCurrentMonth(initialMonth);
  }, [initialMonth]);

  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentYear = currentMonth.year;
  const monthIndex = currentMonth.month;

  const previousMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleDateClick = (day: number) => {
    const dayCampaigns = getCampaignsForDate(
      campaigns,
      currentYear,
      monthIndex,
      day,
      timezone
    );
    if (dayCampaigns.length > 0) {
      setSelectedDate({ year: currentYear, month: monthIndex, day });
      setIsModalOpen(true);
    }
  };

  const calendarDays = generateCalendarDays(currentYear, monthIndex, timezone);
  const selectedDateCampaigns = selectedDate
    ? getCampaignsForDate(
        campaigns,
        selectedDate.year,
        selectedDate.month,
        selectedDate.day,
        timezone
      )
    : [];

  const selectedDateUtc = useMemo(() => {
    if (!selectedDate) return null;
    return zonedWallTimeToUtcDate(
      {
        year: selectedDate.year,
        month: selectedDate.month + 1,
        day: selectedDate.day,
        hour: 12,
        minute: 0,
      },
      timezone
    );
  }, [selectedDate, timezone]);

  return (
    <>
      <Card className="border-border bg-card rounded-2xl shadow-sm">
        <CalendarHeader
          monthName={MONTH_NAMES[monthIndex]}
          year={currentYear}
          onPreviousMonth={previousMonth}
          onNextMonth={nextMonth}
        />
        <CardContent className="p-2 sm:p-6">
          <div className="space-y-2 sm:space-y-4">
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {WEEK_DAYS.map((day, index) => (
                <div
                  key={day}
                  className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2"
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{WEEK_DAYS_MOBILE[index]}</span>
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map((day, index) => {
                const dayCampaigns = day
                  ? getCampaignsForDate(
                      campaigns,
                      currentYear,
                      monthIndex,
                      day,
                      timezone
                    )
                  : [];
                return (
                  <CalendarDayCell
                    // eslint-disable-next-line react/no-array-index-key
                    key={`day-${index}-${day}`}
                    day={day}
                    campaigns={dayCampaigns}
                    isToday={isToday(day, monthIndex, currentYear, timezone)}
                    onClick={() => day && handleDateClick(day)}
                  />
                );
              })}
            </div>

            <CalendarLegend />
          </div>
        </CardContent>
      </Card>

      <CampaignDetailModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedDate={selectedDateUtc}
        campaigns={selectedDateCampaigns}
        timezone={timezone}
      />
    </>
  );
}
