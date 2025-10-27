"use client";

import { motion } from "framer-motion";
import { AlertCircle, Check, Trash2, UserX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  SUBSCRIPTION_STATUSES,
  type SubscriptionStatus,
} from "@/r3tain/community/types";

interface SubscriptionStatusSelectorProps {
  selectedStatus: SubscriptionStatus;
  onStatusChange: (status: SubscriptionStatus) => void;
}

export function SubscriptionStatusSelector({
  selectedStatus,
  onStatusChange,
}: SubscriptionStatusSelectorProps) {
  const getStatusIcon = (status: SubscriptionStatus) => {
    switch (status.value) {
      case "subscribed":
        return <Check className="h-4 w-4 text-green-600" />;
      case "unsubscribed":
        return <UserX className="h-4 w-4 text-red-600" />;
      case "non-subscribed":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "cleaned":
        return <Trash2 className="h-4 w-4 text-gray-600" />;
      default:
        return <Check className="h-4 w-4 text-green-600" />;
    }
  };

  const getStatusColor = (status: SubscriptionStatus) => {
    switch (status.value) {
      case "subscribed":
        return "border-green-200 bg-green-50 dark:bg-green-950/20";
      case "unsubscribed":
        return "border-red-200 bg-red-50 dark:bg-red-950/20";
      case "non-subscribed":
        return "border-amber-200 bg-amber-50 dark:bg-amber-950/20";
      case "cleaned":
        return "border-gray-200 bg-gray-50 dark:bg-gray-950/20";
      default:
        return "border-green-200 bg-green-50 dark:bg-green-950/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <label
          htmlFor="subscription-status"
          className="text-foreground text-sm font-medium"
        >
          Select email marketing status
        </label>
        <Badge variant="destructive" className="text-xs">
          Required
        </Badge>
      </div>

      <Select
        value={selectedStatus.id}
        onValueChange={(value) => {
          const status = SUBSCRIPTION_STATUSES.find((s) => s.id === value);
          if (status) onStatusChange(status);
        }}
      >
        <SelectTrigger
          id="subscription-status"
          className="bg-background border-border hover:border-primary/50 !h-12 w-full transition-colors duration-200"
        >
          <SelectValue placeholder="Select a status..." />
        </SelectTrigger>

        <SelectContent className="w-full">
          <div className="text-muted-foreground border-border mb-2 border-b p-2 text-xs">
            Select a status
          </div>
          {SUBSCRIPTION_STATUSES.map((status) => (
            <SelectItem key={status.id} value={status.id} className="p-4">
              <div className="flex w-full items-start gap-3">
                <div className="mt-0.5 shrink-0">{getStatusIcon(status)}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-foreground mb-1 font-medium">
                    {status.name}
                  </div>
                  <div className="text-muted-foreground text-sm leading-relaxed">
                    {status.description}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Description */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.3 }}
        className={`rounded-lg border p-4 transition-colors duration-200 ${getStatusColor(selectedStatus)}`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">{getStatusIcon(selectedStatus)}</div>
          <div className="flex-1">
            <h4 className="text-foreground mb-2 font-medium">
              When you choose the &quot;{selectedStatus.name}&quot; status for
              your subscribers, it indicates that you&apos;ve gained permission
              to market to them.
            </h4>
            <p className="text-muted-foreground text-sm">
              {selectedStatus.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
