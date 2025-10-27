"use client";

import { motion } from "framer-motion";
import { Users, Zap } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

const resources = [
  {
    title: "How to Manage Community",
    description:
      "Learn best practices for community management, moderation, and engagement strategies.",
    icon: Zap,
    gradient: "from-violet-400 to-purple-400",
  },
  {
    title: "Community Growth Tips",
    description:
      "Discover proven strategies to attract, retain, and engage your community members.",
    icon: Users,
    gradient: "from-cyan-400 to-blue-400",
  },
];

export function AdditionalResources() {
  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="grid gap-4 px-4 sm:grid-cols-2 lg:gap-6"
    >
      {resources.map((resource) => (
        <Card
          key={resource.title}
          className="border-border hover:border-primary/20 group cursor-pointer transition-all duration-300 hover:shadow-lg"
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  "bg-gradient-to-r",
                  resource.gradient,
                  "transition-transform duration-300 group-hover:scale-110"
                )}
              >
                <resource.icon className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="group-hover:text-primary text-base transition-colors duration-200 lg:text-lg">
                {resource.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm lg:text-base">
              {resource.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </motion.section>
  );
}
