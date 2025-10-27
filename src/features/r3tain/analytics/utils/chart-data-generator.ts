import {
  addDays,
  addMonths,
  addWeeks,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";

import { type ChartDataPoint } from "@/r3tain/analytics/types";

export interface FunnelDataPoint {
  step: string;
  email: number;
  sms: number;
  total: number;
  dropOffRate: number;
}

// Generate realistic revenue data with some seasonality and trends
function generateRevenueValue(
  baseValue: number,
  variance: number,
  trend = 0
): number {
  const randomVariance = (Math.random() - 0.5) * variance;
  const seasonality = Math.sin(Date.now() / 1000000) * (baseValue * 0.1);
  return Math.max(
    0,
    Math.round(baseValue + randomVariance + seasonality + trend)
  );
}

export function generateMonthlyData(months = 12): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const startDate = startOfMonth(subDays(new Date(), months * 30));

  for (let i = 0; i < months; i++) {
    const date = addMonths(startDate, i);
    const email = generateRevenueValue(16000, 4000, i * 200);
    const sms = generateRevenueValue(13000, 3000, i * 100);

    data.push({
      period: format(date, "MMM yyyy"),
      email,
      sms,
      total: email + sms,
      date,
    });
  }

  return data;
}

export function generateWeeklyData(weeks = 53): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const startDate = startOfWeek(subDays(new Date(), weeks * 7));

  for (let i = 0; i < weeks; i++) {
    const date = addWeeks(startDate, i);
    const weekStart = format(date, "MMM dd");
    const weekEnd = format(addDays(date, 6), "MMM dd");

    // Add some special high-value weeks (like the Feb 06-Feb 12 example)
    const isSpecialWeek =
      i === Math.floor(weeks * 0.3) || i === Math.floor(weeks * 0.7);
    const emailBase = isSpecialWeek ? 4000 : 800;
    const smsBase = isSpecialWeek ? 2300 : 500;

    const email = generateRevenueValue(emailBase, emailBase * 0.3);
    const sms = generateRevenueValue(smsBase, smsBase * 0.3);

    data.push({
      period: `${weekStart}-${weekEnd}`,
      email,
      sms,
      total: email + sms,
      date,
    });
  }

  return data;
}

export function generateDailyData(days = 364): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const startDate = subDays(new Date(), days);

  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);
    const email = generateRevenueValue(200, 150);
    const sms = generateRevenueValue(150, 100);

    data.push({
      period: format(date, "MMM dd"),
      email,
      sms,
      total: email + sms,
      date,
    });
  }

  return data;
}

export function generateFunnelData(
  channel: "email" | "sms" | "all" = "all"
): FunnelDataPoint[] {
  const baseDeliveries =
    channel === "email" ? 10000 : channel === "sms" ? 8000 : 18000;
  const deliveries = generateRevenueValue(baseDeliveries, baseDeliveries * 0.1);

  // Realistic conversion rates
  const openRate = channel === "email" ? 0.25 : channel === "sms" ? 0.95 : 0.35;
  const clickRate = 0.15; // of opens
  const conversionRate = 0.08; // of clicks

  const opened = Math.round(deliveries * openRate);
  const clicked = Math.round(opened * clickRate);
  const orders = Math.round(clicked * conversionRate);

  const steps = [
    { step: "Deliveries", value: deliveries },
    { step: "Opened", value: opened },
    { step: "Clicked", value: clicked },
    { step: "Orders", value: orders },
  ];

  return steps.map((step, index) => {
    const nextStep = steps[index + 1];
    const dropOffRate = nextStep
      ? ((step.value - nextStep.value) / step.value) * 100
      : 0;

    return {
      step: step.step,
      email: channel === "email" || channel === "all" ? step.value : 0,
      sms:
        channel === "sms" || channel === "all"
          ? Math.round(step.value * 0.4)
          : 0,
      total: step.value,
      dropOffRate: Math.round(dropOffRate),
    };
  });
}
