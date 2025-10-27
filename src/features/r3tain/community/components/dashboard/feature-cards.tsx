"use client";

import { motion } from "framer-motion";
import { BookOpen, Target, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

const featureCards = [
  {
    title: "R3tain Communities 101",
    description:
      "Here's what you need to know before you start building your community.",
    icon: BookOpen,
    color: "bg-emerald-50 dark:bg-emerald-950/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "We'll walk you through the process",
    description:
      "Learn how to build and organize your community in this free, introductory lesson.",
    icon: Target,
    color: "bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "More ways to Grow Communities",
    description:
      "Browse our collection of resources, case studies and tips for growing your community.",
    icon: TrendingUp,
    color: "bg-amber-50 dark:bg-amber-950/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

export function FeatureCards() {
  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="px-4"
    >
      <h3 className="text-foreground mb-4 text-xl font-semibold lg:mb-6 lg:text-2xl">
        What is a community?
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {featureCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group cursor-pointer"
          >
            <Card className="border-border hover:border-primary/20 h-full transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div
                  className={cn(
                    card.color,
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 lg:h-16 lg:w-16"
                  )}
                >
                  <card.icon
                    className={cn("h-6 w-6 lg:h-8 lg:w-8", card.iconColor)}
                  />
                </div>
                <CardTitle className="group-hover:text-primary text-base transition-colors duration-200 lg:text-lg">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed lg:text-base">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
