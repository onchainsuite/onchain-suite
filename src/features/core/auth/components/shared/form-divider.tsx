"use client";

import { motion } from "framer-motion";

import { Separator } from "@/ui/separator";

interface FormDividerProps {
  text?: string;
  delay?: number;
}

export function FormDivider({
  text = "or continue with email",
  delay = 0.6,
}: FormDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      <Separator />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-card text-muted-foreground px-3 text-sm">
          {text}
        </span>
      </div>
    </motion.div>
  );
}
