"use client";

import { motion } from "framer-motion";
import { v7 } from "uuid";

import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  helpLinks?: {
    text: string;
    onClick: () => void;
  }[];
  delay?: number;
}

export function PageHeader({
  title,
  subtitle,
  helpLinks,
  delay = 0.2,
}: PageHeaderProps) {
  return (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      className="mx-auto max-w-4xl text-center"
    >
      <motion.h2
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
        className="text-foreground mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="text-muted-foreground mb-6 text-base leading-relaxed lg:text-lg"
        >
          {subtitle}
        </motion.p>
      )}

      {helpLinks && helpLinks.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          className="flex flex-wrap justify-center gap-4 text-sm"
        >
          {helpLinks.map((link) => (
            <Button
              key={v7()}
              variant="link"
              onClick={link.onClick}
              className="text-primary hover:text-primary/80 p-0"
            >
              {link.text}
            </Button>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}
