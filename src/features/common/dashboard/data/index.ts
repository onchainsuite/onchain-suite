import { BarChart3, Lock, Mail } from "lucide-react";

import { type Activity } from "@/common/dashboard/types";

export const activities: Activity[] = [
  {
    time: "10:32 AM",
    message: "R3tain drip for 20 users (3ridge webhook)",
    type: "r3tain",
    icon: Mail,
  },
  {
    time: "10:28 AM",
    message: "3ridge wallet connect event received",
    type: "3ridge",
    icon: Lock,
  },
  {
    time: "10:15 AM",
    message: "Onch3n cohort analysis completed",
    type: "onch3n",
    icon: BarChart3,
  },
  {
    time: "10:05 AM",
    message: "R3tain campaign opened by 15 users",
    type: "r3tain",
    icon: Mail,
  },
  {
    time: "09:58 AM",
    message: "3ridge authentication flow triggered",
    type: "3ridge",
    icon: Lock,
  },
  {
    time: "09:45 AM",
    message: "Onch3n detected 5 at-risk users",
    type: "onch3n",
    icon: BarChart3,
  },
  {
    time: "09:32 AM",
    message: "R3tain sequence scheduled for tomorrow",
    type: "r3tain",
    icon: Mail,
  },
  {
    time: "09:20 AM",
    message: "3ridge webhook test successful",
    type: "3ridge",
    icon: Lock,
  },
  {
    time: "09:10 AM",
    message: "Onch3n AI tip generated",
    type: "onch3n",
    icon: BarChart3,
  },
  {
    time: "09:00 AM",
    message: "R3tain deliverability check passed",
    type: "r3tain",
    icon: Mail,
  },
];
