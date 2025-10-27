import { addDays, subDays } from "date-fns";

export interface MessagePerformanceData {
  id: string;
  name: string;
  type: "email" | "sms";
  date: Date;
  openRate: number;
  clickRate: number;
  sent: number;
  opens: number;
  clicks: number;
}

export type MessageMetric = "open-rate" | "click-rate";

// Sample message names for realistic data
const emailMessageNames = [
  "Winter Promo",
  "Black Friday",
  "Seasonal Sale Email",
  "Abandoned Cart",
  "Newsletter Weekly",
  "Product Launch",
  "Customer Survey",
  "Holiday Special",
  "Welcome Series",
  "Re-engagement",
  "Flash Sale",
  "Monthly Update",
  "Birthday Offer",
  "Loyalty Rewards",
  "New Arrivals",
  "End of Season",
  "VIP Access",
  "Thank You",
  "Feedback Request",
  "Special Discount",
];

const smsMessageNames = [
  "Fresh for Spring",
  "Limited Time Offer",
  "Order Confirmation",
  "Delivery Update",
  "Flash Sale Alert",
  "Appointment Reminder",
  "Payment Due",
  "New Product Alert",
  "Exclusive Deal",
  "Cart Reminder",
  "Shipping Notice",
  "Survey Invite",
  "Promo Code",
  "Event Reminder",
  "Stock Alert",
  "Welcome SMS",
  "Loyalty Points",
  "Sale Ending",
  "Special Offer",
  "Thank You SMS",
];

function generateMessagePerformance(
  name: string,
  type: "email" | "sms",
  date: Date
): MessagePerformanceData {
  // SMS typically has higher open rates (95%+) but lower click rates
  // Email has lower open rates (15-25%) but higher click rates relative to opens

  const sent = Math.floor(Math.random() * 5000) + 1000;

  let openRate: number;
  let clickRate: number;

  if (type === "sms") {
    // SMS open rates: 90-98%
    openRate = 90 + Math.random() * 8;
    // SMS click rates: 3-8% of sent (not opens)
    clickRate = 3 + Math.random() * 5;
  } else {
    // Email open rates: 15-35%
    openRate = 15 + Math.random() * 20;
    // Email click rates: 2-5% of sent
    clickRate = 2 + Math.random() * 3;
  }

  const opens = Math.round(sent * (openRate / 100));
  const clicks = Math.round(sent * (clickRate / 100));

  return {
    id: `${type}-${name.toLowerCase().replace(/\s+/g, "-")}-${date.getTime()}`,
    name,
    type,
    date,
    openRate: Math.round(openRate * 10) / 10,
    clickRate: Math.round(clickRate * 10) / 10,
    sent,
    opens,
    clicks,
  };
}

export function generateMessagePerformanceData(
  count = 50
): MessagePerformanceData[] {
  const data: MessagePerformanceData[] = [];
  const startDate = subDays(new Date(), 90); // Last 90 days

  for (let i = 0; i < count; i++) {
    // Mix of email and SMS messages
    const isEmail = Math.random() > 0.4; // 60% email, 40% SMS
    const messageNames = isEmail ? emailMessageNames : smsMessageNames;
    const name = messageNames[Math.floor(Math.random() * messageNames.length)];
    const type = isEmail ? "email" : "sms";

    // Random date within the last 90 days
    const randomDays = Math.floor(Math.random() * 90);
    const date = addDays(startDate, randomDays);

    data.push(generateMessagePerformance(name, type, date));
  }

  // Sort by date descending (newest first)
  return data.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getMPMetricValue(
  message: MessagePerformanceData,
  metric: MessageMetric
): number {
  switch (metric) {
    case "open-rate":
      return message.openRate;
    case "click-rate":
      return message.clickRate;
    default:
      return 0;
  }
}

export function getMPMetricLabel(metric: MessageMetric): string {
  switch (metric) {
    case "open-rate":
      return "Open rate";
    case "click-rate":
      return "Click rate";
    default:
      return "";
  }
}
