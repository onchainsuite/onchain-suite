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

export function getCampaignsForDate(
  campaigns: Campaign[],
  year: number,
  month: number,
  day: number
): Campaign[] {
  const dateToCheck = new Date(year, month, day);
  return campaigns.filter((campaign) => {
    if (!campaign.scheduledFor) return false;
    const campaignDate = new Date(campaign.scheduledFor);
    return (
      campaignDate.getDate() === dateToCheck.getDate() &&
      campaignDate.getMonth() === dateToCheck.getMonth() &&
      campaignDate.getFullYear() === dateToCheck.getFullYear()
    );
  });
}

export function isToday(
  day: number | null,
  currentMonth: number,
  currentYear: number
): boolean {
  if (!day) return false;
  const today = new Date();
  return (
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear()
  );
}

export function generateCalendarDays(
  year: number,
  month: number
): (number | null)[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return calendarDays;
}
