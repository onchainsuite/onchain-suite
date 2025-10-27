import {
  addDays,
  addMonths,
  addWeeks,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";

export interface PerformanceDataPoint {
  period: string;
  clickRate: number;
  clicksPerUniqueOpens: number;
  openRate: number;
  totalSends: number;
  unsubscribeRate: number;
  date: Date;
}

export type PerformanceMetric =
  | "click-rate"
  | "clicks-per-unique-opens"
  | "open-rate"
  | "total-sends"
  | "unsubscribe-rate";

// Generate realistic performance metrics with some variance and trends
function generatePerformanceValue(
  baseValue: number,
  variance: number,
  trend = 0,
  isPercentage = true
): number {
  const randomVariance = (Math.random() - 0.5) * variance;
  const seasonality = Math.sin(Date.now() / 1000000) * (baseValue * 0.1);
  const value = Math.max(0, baseValue + randomVariance + seasonality + trend);

  if (isPercentage) {
    return Math.min(100, Math.round(value * 100) / 100); // Cap at 100% and round to 2 decimals
  }

  return Math.round(value);
}

export function generatePerformanceMonthlyData(
  months = 12
): PerformanceDataPoint[] {
  const data: PerformanceDataPoint[] = [];
  const startDate = startOfMonth(subDays(new Date(), months * 30));

  for (let i = 0; i < months; i++) {
    const date = addMonths(startDate, i);

    // Base values with slight upward trends
    const clickRate = generatePerformanceValue(2.5, 1.0, i * 0.05);
    const clicksPerUniqueOpens = generatePerformanceValue(
      1.8,
      0.5,
      i * 0.02,
      false
    );
    const openRate = generatePerformanceValue(22, 5, i * 0.1);
    const totalSends = generatePerformanceValue(15000, 3000, i * 200, false);
    const unsubscribeRate = generatePerformanceValue(0.3, 0.15);

    data.push({
      period: format(date, "MMM yyyy"),
      clickRate,
      clicksPerUniqueOpens,
      openRate,
      totalSends,
      unsubscribeRate,
      date,
    });
  }

  return data;
}

export function generatePerformanceWeeklyData(
  weeks = 53
): PerformanceDataPoint[] {
  const data: PerformanceDataPoint[] = [];
  const startDate = startOfWeek(subDays(new Date(), weeks * 7));

  for (let i = 0; i < weeks; i++) {
    const date = addWeeks(startDate, i);
    const weekStart = format(date, "MMM dd");
    const weekEnd = format(addDays(date, 6), "MMM dd");

    // Weekly variations with some seasonal patterns
    const clickRate = generatePerformanceValue(2.3, 0.8, Math.sin(i / 8) * 0.3);
    const clicksPerUniqueOpens = generatePerformanceValue(
      1.7,
      0.4,
      Math.sin(i / 6) * 0.1,
      false
    );
    const openRate = generatePerformanceValue(21, 4, Math.sin(i / 10) * 2);
    const totalSends = generatePerformanceValue(
      3500,
      800,
      Math.sin(i / 4) * 500,
      false
    );
    const unsubscribeRate = generatePerformanceValue(0.25, 0.1);

    data.push({
      period: `${weekStart}-${weekEnd}`,
      clickRate,
      clicksPerUniqueOpens,
      openRate,
      totalSends,
      unsubscribeRate,
      date,
    });
  }

  return data;
}

export function generatePerformanceDailyData(
  days = 30
): PerformanceDataPoint[] {
  const data: PerformanceDataPoint[] = [];
  const startDate = subDays(new Date(), days);

  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);

    // Daily variations with weekend effects
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const weekendMultiplier = isWeekend ? 0.8 : 1.0;

    const clickRate = generatePerformanceValue(2.1 * weekendMultiplier, 0.6);
    const clicksPerUniqueOpens = generatePerformanceValue(
      1.6 * weekendMultiplier,
      0.3,
      0,
      false
    );
    const openRate = generatePerformanceValue(20 * weekendMultiplier, 3);
    const totalSends = generatePerformanceValue(
      800 * weekendMultiplier,
      200,
      0,
      false
    );
    const unsubscribeRate = generatePerformanceValue(0.2, 0.08);

    data.push({
      period: format(date, "MMM dd"),
      clickRate,
      clicksPerUniqueOpens,
      openRate,
      totalSends,
      unsubscribeRate,
      date,
    });
  }

  return data;
}

export function getPerformanceMetricValue(
  dataPoint: PerformanceDataPoint,
  metric: PerformanceMetric
): number {
  switch (metric) {
    case "click-rate":
      return dataPoint.clickRate;
    case "clicks-per-unique-opens":
      return dataPoint.clicksPerUniqueOpens;
    case "open-rate":
      return dataPoint.openRate;
    case "total-sends":
      return dataPoint.totalSends;
    case "unsubscribe-rate":
      return dataPoint.unsubscribeRate;
    default:
      return 0;
  }
}

export function getPerformanceMetricLabel(metric: PerformanceMetric): string {
  switch (metric) {
    case "click-rate":
      return "Click rate";
    case "clicks-per-unique-opens":
      return "Clicks per unique opens";
    case "open-rate":
      return "Open rate";
    case "total-sends":
      return "Total sends";
    case "unsubscribe-rate":
      return "Unsubscribe rate";
    default:
      return "";
  }
}

export function isPercentageMetric(metric: PerformanceMetric): boolean {
  return metric !== "clicks-per-unique-opens" && metric !== "total-sends";
}
