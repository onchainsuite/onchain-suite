"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ImportMethodCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  helpText: string;
  onHelpClick: () => void;
  onSelect: () => void;
  isSelected: boolean;
  delay?: number;
}

export function ImportMethodCard({
  title,
  description,
  icon: Icon,
  helpText,
  onHelpClick,
  onSelect,
  isSelected,
  delay = 0,
}: ImportMethodCardProps) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <Card
        className={`h-full border-2 transition-all duration-300 hover:shadow-lg ${
          isSelected
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/30"
        }`}
        onClick={onSelect}
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              }`}
            >
              <Icon className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3
                className={`text-lg font-semibold transition-colors duration-200 ${
                  isSelected
                    ? "text-primary"
                    : "text-foreground group-hover:text-primary"
                }`}
              >
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>

            <Button
              variant="link"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onHelpClick();
              }}
              className="text-primary hover:text-primary/80 h-auto p-0 font-normal"
            >
              {helpText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
