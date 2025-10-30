import { AlertCircle, DollarSign, TrendingUp, Users } from "lucide-react";

import { type Alert } from "../types";

// Mock data
export const alerts: Alert[] = [
  {
    name: "Churn Rate Spike",
    type: "Critical",
    severity: "high",
    timestamp: "2 hours ago",
    description: "Churn rate increased by 15% in the last 24 hours",
    icon: AlertCircle,
    status: "Active",
  },
  {
    name: "Revenue Milestone",
    type: "Info",
    severity: "low",
    timestamp: "5 hours ago",
    description: "Monthly revenue exceeded $1M target",
    icon: DollarSign,
    status: "Active",
  },
  {
    name: "User Growth Surge",
    type: "Info",
    severity: "medium",
    timestamp: "1 day ago",
    description: "New user signups up 45% week-over-week",
    icon: TrendingUp,
    status: "Resolved",
  },
  {
    name: "Segment Anomaly",
    type: "Warning",
    severity: "medium",
    timestamp: "2 days ago",
    description: "Unusual activity in High-Value Traders segment",
    icon: Users,
    status: "Snoozed",
  },
];
