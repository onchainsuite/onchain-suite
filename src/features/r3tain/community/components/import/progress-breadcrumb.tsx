"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface BreadcrumbStep {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface ProgressBreadcrumbProps {
  steps: BreadcrumbStep[];
}

export function ProgressBreadcrumb({ steps }: ProgressBreadcrumbProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2 pb-2 overflow-x-auto text-sm text-muted-foreground"
    >
      {steps.map((step, index) => (
        <div
          key={step.label}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`transition-colors duration-200 ${
              step.isActive
                ? "text-primary font-medium"
                : step.isCompleted
                  ? "text-foreground"
                  : "text-muted-foreground"
            }`}
          >
            {step.label}
          </motion.span>
          {index < steps.length - 1 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
          )}
        </div>
      ))}
    </motion.nav>
  );
}
