"use client";

import { motion } from "framer-motion";
import { type LucideIcon, Sparkles } from "lucide-react";

interface AuthHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle: string;
  delay?: number;
}

export function AuthHeader({
  icon: Icon = Sparkles,
  title,
  subtitle,
  delay = 0.1,
}: AuthHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="mb-8 text-center"
    >
      <div className="mb-4 flex items-center justify-center">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.05 }}
          className="from-primary to-primary/70 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r"
        >
          <Icon className="h-7 w-7 text-white" />
        </motion.div>
      </div>
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
}
