import { AlertCircle, DollarSign, TrendingUp, Users } from "lucide-react";

export const storySteps = [
  {
    title: "User Growth Acceleration",
    description: "New user signups increased by 45% over the past 30 days",
    metric: "+45%",
    icon: Users,
    color: "text-green-500",
  },
  {
    title: "Revenue Impact",
    description:
      "Transaction volume grew proportionally, generating $2.3M in additional revenue",
    metric: "$2.3M",
    icon: DollarSign,
    color: "text-blue-500",
  },
  {
    title: "Engagement Patterns",
    description:
      "Peak activity shifted to evening hours, with 67% of transactions occurring between 6-10 PM",
    metric: "67%",
    icon: TrendingUp,
    color: "text-primary",
  },
  {
    title: "Retention Challenge",
    description:
      "However, 7-day retention dropped by 8%, indicating onboarding friction",
    metric: "-8%",
    icon: AlertCircle,
    color: "text-yellow-500",
  },
];
