"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MobileImportCardProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  illustration: React.ReactNode;
  delay?: number;
}

export function MobileImportCard({
  title,
  description,
  actionText,
  onAction,
  illustration,
  delay = 0,
}: MobileImportCardProps) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3 }}
      className="group"
    >
      <Card className="border-border hover:border-primary/20 transition-all duration-300 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <div className="from-primary/10 to-primary/5 flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-105">
              {illustration}
            </div>

            <div className="flex-1 space-y-3">
              <h4 className="text-foreground group-hover:text-primary font-semibold transition-colors duration-200">
                {title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={onAction}
                className="text-primary hover:text-primary/80 h-auto p-0 font-normal"
              >
                {actionText}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
