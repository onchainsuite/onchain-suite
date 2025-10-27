import {
  addDays,
  addMonths,
  addWeeks,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";

export interface DeliveryDataPoint {
  period: string;
  bounceRate: number;
  abuseReportRate: number;
  deliveryRate: number;
  unsubscribeRate: number;
  emailsSent: number;
  deliveries: number;
  bounces: number;
  unsubscribed: number;
  abuseReports: number;
  date: Date;
}

export type DeliveryMetric =
  | "bounce-rate"
  | "abuse-report-rate"
  | "delivery-rate"
  | "unsubscribe-rate";

// Generate realistic delivery metrics with proper relationships
function generateDeliveryMetrics(
  baseEmailsSent: number,
  variance: number
): {
  emailsSent: number;
  deliveries: number;
  bounces: number;
  unsubscribed: number;
  abuseReports: number;
  bounceRate: number;
  abuseReportRate: number;
  deliveryRate: number;
  unsubscribeRate: number;
} {
  const emailsSent = Math.max(
    1000,
    Math.round(baseEmailsSent + (Math.random() - 0.5) * variance)
  );

  // Realistic delivery rates (85-98%)
  const deliveryRate = 85 + Math.random() * 13;
  const deliveries = Math.round(emailsSent * (deliveryRate / 100));

  // Bounce rate is inverse of delivery rate
  const bounces = emailsSent - deliveries;
  const bounceRate = (bounces / emailsSent) * 100;

  // Abuse reports (0.01% - 0.5% of sent emails)
  const abuseReportRate = Math.random() * 0.49 + 0.01;
  const abuseReports = Math.round(emailsSent * (abuseReportRate / 100));

  // Unsubscribe rate (0.1% - 2% of delivered emails)
  const unsubscribeRate = Math.random() * 1.9 + 0.1;
  const unsubscribed = Math.round(deliveries * (unsubscribeRate / 100));

  return {
    emailsSent,
    deliveries,
    bounces,
    unsubscribed,
    abuseReports,
    bounceRate: Math.round(bounceRate * 100) / 100,
    abuseReportRate: Math.round(abuseReportRate * 100) / 100,
    deliveryRate: Math.round(deliveryRate * 100) / 100,
    unsubscribeRate: Math.round(unsubscribeRate * 100) / 100,
  };
}

export function generateDeliveryMonthlyData(months = 12): DeliveryDataPoint[] {
  const data: DeliveryDataPoint[] = [];
  const startDate = startOfMonth(subDays(new Date(), months * 30));

  for (let i = 0; i < months; i++) {
    const date = addMonths(startDate, i);
    const baseEmailsSent = 50000 + i * 2000; // Growing trend
    const metrics = generateDeliveryMetrics(baseEmailsSent, 10000);

    data.push({
      period: format(date, "MMM yyyy"),
      date,
      ...metrics,
    });
  }

  return data;
}

export function generateDeliveryWeeklyData(weeks = 53): DeliveryDataPoint[] {
  const data: DeliveryDataPoint[] = [];
  const startDate = startOfWeek(subDays(new Date(), weeks * 7));

  for (let i = 0; i < weeks; i++) {
    const date = addWeeks(startDate, i);
    const weekStart = format(date, "MMM dd");
    const weekEnd = format(addDays(date, 6), "MMM dd");

    const baseEmailsSent = 12000 + Math.sin(i / 4) * 3000; // Seasonal variation
    const metrics = generateDeliveryMetrics(baseEmailsSent, 2000);

    data.push({
      period: `${weekStart}-${weekEnd}`,
      date,
      ...metrics,
    });
  }

  return data;
}

export function generateDeliveryDailyData(days = 30): DeliveryDataPoint[] {
  const data: DeliveryDataPoint[] = [];
  const startDate = subDays(new Date(), days);

  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);
    const baseEmailsSent = 2000 + Math.random() * 1000;
    const metrics = generateDeliveryMetrics(baseEmailsSent, 500);

    data.push({
      period: format(date, "MMM dd"),
      date,
      ...metrics,
    });
  }

  return data;
}

export function getMetricValue(
  dataPoint: DeliveryDataPoint,
  metric: DeliveryMetric
): number {
  switch (metric) {
    case "bounce-rate":
      return dataPoint.bounceRate;
    case "abuse-report-rate":
      return dataPoint.abuseReportRate;
    case "delivery-rate":
      return dataPoint.deliveryRate;
    case "unsubscribe-rate":
      return dataPoint.unsubscribeRate;
    default:
      return 0;
  }
}

export function getMetricLabel(metric: DeliveryMetric): string {
  switch (metric) {
    case "bounce-rate":
      return "Bounce rate";
    case "abuse-report-rate":
      return "Abuse report rate";
    case "delivery-rate":
      return "Delivery rate";
    case "unsubscribe-rate":
      return "Unsubscribe rate";
    default:
      return "";
  }
}
