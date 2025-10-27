"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BarChart3, TrendingUp } from "lucide-react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ComparativeReports() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl space-y-6 text-center lg:space-y-8"
      >
        {/* Icon */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl lg:h-20 lg:w-20">
              <BarChart3 className="text-primary h-8 w-8 lg:h-10 lg:w-10" />
            </div>
            <motion.div
              className="bg-success/20 absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full lg:h-8 lg:w-8"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <TrendingUp className="text-success h-3 w-3 lg:h-4 lg:w-4" />
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-3 lg:space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-foreground mb-2 text-2xl font-bold lg:text-3xl">
              Comparative Reports
            </h2>
            <Badge
              variant="secondary"
              className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20"
            >
              Premium Feature
            </Badge>
          </motion.div>

          <motion.p
            className="text-muted-foreground text-base leading-relaxed lg:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Comparative Reports are available for Standard and Premium users.
          </motion.p>

          <motion.p
            className="text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Compare your campaign performance across different time periods,
            audience segments, and campaign types to gain deeper insights into
            your marketing effectiveness.
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col justify-center gap-3 sm:flex-row lg:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            size="lg"
          >
            <ArrowUpRight className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">
              Upgrade To Standard or Premium
            </span>
            <span className="sm:hidden">Upgrade Plan</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-border/50 hover:bg-accent/50 bg-transparent"
          >
            Learn more
          </Button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {[
            {
              title: "Time Comparison",
              description: "Compare performance across different time periods",
              icon: "📊",
            },
            {
              title: "Audience Insights",
              description:
                "Analyze how different segments respond to your campaigns",
              icon: "👥",
            },
            {
              title: "Campaign Analysis",
              description: "Compare different campaign types and strategies",
              icon: "🎯",
            },
          ].map((feature, index) => (
            <Card
              key={v7()}
              className="border-border/50 bg-card/30 backdrop-blur-sm"
            >
              <CardContent className="space-y-2 p-3 text-center lg:p-4">
                <div className="mb-2 text-xl lg:text-2xl">{feature.icon}</div>
                <h4 className="text-foreground text-sm font-medium lg:text-base">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
