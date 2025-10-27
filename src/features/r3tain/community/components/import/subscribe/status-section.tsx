"use client";

import { motion } from "framer-motion";

import { SubscriptionStatusSelector } from "../subscription-status-selector";
import type { SubscriptionStatus } from "@/r3tain/community/types";

interface StatusSectionProps {
  selectedStatus: SubscriptionStatus;
  onStatusChange: (status: SubscriptionStatus) => void;
}

export function StatusSection({
  selectedStatus,
  onStatusChange,
}: StatusSectionProps) {
  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <SubscriptionStatusSelector
        selectedStatus={selectedStatus}
        onStatusChange={onStatusChange}
      />
    </motion.section>
  );
}
