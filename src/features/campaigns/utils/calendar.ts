import { getZonedDateTimeParts, zonedWallTimeToUtcDate } from "@/lib/timezone";

import type { Campaign } from "../../campaigns/types";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEK_DAYS_MOBILE = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * The date a campaign occupies on the calendar: its scheduled slot, or —
 * for send-now campaigns that never had a schedule — the time it was sent.
 */
export function getCampaignCalendarDate(campaign: Campaign): Date | undefined {
  return campaign.scheduledFor ?? campaign.sentAt;
}

export function getCampaignsForDate(
  campaigns: Campaign[],
  year: number,
  month: number,
  day: number,
  timeZone: string
): Campaign[] {
  return campaigns.filter((campaign) => {
    const eventDate = getCampaignCalendarDate(campaign);
    if (!eventDate) return false;
    const z = getZonedDateTimeParts(new Date(eventDate), timeZone);
    return z.day === day && z.month - 1 === month && z.year === year;
  });
}

export function isToday(
  day: number | null,
  currentMonth: number,
  currentYear: number,
  timeZone: string
): boolean {
  if (!day) return false;
  const today = getZonedDateTimeParts(new Date(), timeZone);
  return (
    day === today.day &&
    currentMonth === today.month - 1 &&
    currentYear === today.year
  );
}

export function generateCalendarDays(
  year: number,
  month: number,
  timeZone: string
): (number | null)[] {
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayUtc = zonedWallTimeToUtcDate(
    { year, month: month + 1, day: 1, hour: 12, minute: 0 },
    timeZone
  );
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(firstDayUtc);
  const startingDayOfWeek = WEEK_DAYS.indexOf(weekday);
  const start = startingDayOfWeek >= 0 ? startingDayOfWeek : 0;

  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < start; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return calendarDays;
}
