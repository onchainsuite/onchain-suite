"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

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

interface CampaignsCalendarProps {
  campaigns: Campaign[];
}

export function CampaignsCalendar({ campaigns }: CampaignsCalendarProps) {
  const firstCampaignDate = campaigns.find((c) => c.scheduledFor)?.scheduledFor;
  const [currentDate, setCurrentDate] = useState(
    firstCampaignDate ? new Date(firstCampaignDate) : new Date()
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const dayCampaigns = getCampaignsForDate(
      campaigns,
      currentYear,
      currentMonth,
      day
    );
    if (dayCampaigns.length > 0) {
      setSelectedDate(new Date(currentYear, currentMonth, day));
      setIsModalOpen(true);
    }
  };

  const calendarDays = generateCalendarDays(currentYear, currentMonth);
  const selectedDateCampaigns = selectedDate
    ? getCampaignsForDate(
        campaigns,
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    : [];

  return (
    <>
      <Card className="border-border bg-card rounded-2xl shadow-sm">
        <CalendarHeader
          monthName={MONTH_NAMES[currentMonth]}
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
                      currentMonth,
                      day
                    )
                  : [];
                return (
                  <CalendarDayCell
                    // eslint-disable-next-line react/no-array-index-key
                    key={`day-${index}-${day}`}
                    day={day}
                    campaigns={dayCampaigns}
                    isToday={isToday(day, currentMonth, currentYear)}
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
        selectedDate={selectedDate}
        campaigns={selectedDateCampaigns}
      />
    </>
  );
}
