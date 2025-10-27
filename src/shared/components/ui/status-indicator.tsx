"use client";

import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "success" | "warning" | "error" | "loading" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
  },
  warning: {
    icon: AlertCircle,
    color: "text-amber-600 dark:text-amber-400",
  },
  error: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
  },
  loading: {
    icon: Loader2,
    color: "text-blue-600 dark:text-blue-400 animate-spin",
  },
  info: {
    icon: AlertCircle,
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
