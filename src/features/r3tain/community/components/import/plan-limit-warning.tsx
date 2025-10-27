"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlanLimitWarningProps {
  current: number;
  limit: number;
  planType: string;
  newSubscribers: number;
}

export function PlanLimitWarning({
  current,
  limit,
  planType,
  newSubscribers,
}: PlanLimitWarningProps) {
  const totalAfterImport = current + newSubscribers;
  const willExceedLimit = totalAfterImport > limit;

  if (!willExceedLimit) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Alert
        variant="destructive"
        className="border-amber-200 bg-amber-50 dark:bg-amber-950/20"
      >
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <p className="mb-2 font-medium">Plan Limit Warning</p>
          <p className="text-sm leading-relaxed">
            The maximum number of subscribers allowed on your {planType} plan is{" "}
            {limit.toLocaleString()}. You currently have{" "}
            {current.toLocaleString()} subscribers. If you go beyond{" "}
            {limit.toLocaleString()} subscribers with this import, your ability
            to send email campaigns may be impacted.
          </p>
          <p className="mt-2 text-sm">
            <strong>After import:</strong> {totalAfterImport.toLocaleString()}{" "}
            subscribers (
            {totalAfterImport - limit > 0
              ? `+${totalAfterImport - limit} over limit`
              : "within limit"}
            )
          </p>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
