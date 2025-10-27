"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatusIndicator } from "@/ui/status-indicator";

interface ValidationErrorsProps {
  errors: string[];
}

export function ValidationErrors({ errors }: ValidationErrorsProps) {
  if (errors.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-2"
      >
        {errors.map((error, index) => (
          <Alert key={index} variant="destructive">
            <StatusIndicator status="error" size="sm" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
