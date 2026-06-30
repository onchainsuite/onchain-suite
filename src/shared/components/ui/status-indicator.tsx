"use client";

import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "success" | "warning" | "error" | "loading" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircleIcon,
    color: "text-green-600 dark:text-green-400",
  },
  warning: {
    icon: ExclamationCircleIcon,
    color: "text-amber-600 dark:text-amber-400",
  },
  error: {
    icon: XCircleIcon,
    color: "text-red-600 dark:text-red-400",
  },
  loading: {
    icon: ArrowPathIcon,
    color: "text-blue-600 dark:text-blue-400 animate-spin",
  },
  info: {
    icon: ExclamationCircleIcon,
    color: "text-blue-600 dark:text-blue-400",
  },
};

const sizeConfig = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function StatusIndicator({
  status,
  size = "md",
  className,
}: StatusIndicatorProps) {
  const { icon: Icon, color } = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return <Icon className={cn(color, sizeClass, className)} />;
}
