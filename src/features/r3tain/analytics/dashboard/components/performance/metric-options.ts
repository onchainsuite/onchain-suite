import { BarChart3, Mail, Truck, Users } from "lucide-react";

export interface MetricOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: "engagement" | "delivery";
  tooltip?: string;
}

export const metricOptions: MetricOption[] = [
  {
    value: "click-rate",
    label: "Click rate",
    icon: BarChart3,
    group: "engagement",
    tooltip:
      "The percentage of successfully delivered messages that registered a click.",
  },
  {
    value: "clicks-per-unique-opens",
    label: "Clicks per unique opens",
    icon: BarChart3,
    group: "engagement",
    tooltip: "The average number of clicks per unique email open.",
  },
  { value: "opened", label: "Opened", icon: Mail, group: "engagement" },
  {
    value: "total-opens",
    label: "Total opens",
    icon: Mail,
    group: "engagement",
  },
  {
    value: "open-rate",
    label: "Open rate",
    icon: Mail,
    group: "engagement",
    tooltip:
      "The percentage of successfully delivered messages that were opened.",
  },
  {
    value: "total-sends",
    label: "Total sends",
    icon: Mail,
    group: "delivery",
    tooltip:
      "The total number of messages sent during the selected time period.",
  },
  {
    value: "unsubscribe-rate",
    label: "Unsubscribe rate",
    icon: Users,
    group: "delivery",
    tooltip:
      "The percentage of recipients who unsubscribed after receiving your message.",
  },
  {
    value: "unsubscribed",
    label: "Unsubscribed",
    icon: Users,
    group: "delivery",
  },
  {
    value: "delivery-rate",
    label: "Delivery rate",
    icon: Truck,
    group: "delivery",
  },
  { value: "deliveries", label: "Deliveries", icon: Truck, group: "delivery" },
];
