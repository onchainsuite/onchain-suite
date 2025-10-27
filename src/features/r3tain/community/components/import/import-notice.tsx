"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

export function ImportNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <p className="mb-2 font-medium">Important Notice</p>
          <p className="text-sm leading-relaxed">
            These imported subscribers will not receive a confirmation email
            from R3tain. Since you&apos;re adding them manually, they won&apos;t
            have an opt-in IP address or date in your records, so be extra sure
            you have permission first.
          </p>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
