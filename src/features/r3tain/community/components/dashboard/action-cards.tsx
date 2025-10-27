"use client";

import { motion } from "framer-motion";
import { ChevronRight, FileText, Globe, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

const actionCards = [
  {
    title: "Create a Signup Form",
    description:
      "Capture contacts and collect the data you need to grow your R3tain community.",
    action: "Create Form",
    icon: FileText,
    gradient: "from-orange-400 to-pink-400",
  },
  {
    title: "Create a Landing Page",
    description:
      "Build beautiful landing pages to showcase your community and attract new members.",
    action: "Create Page",
    icon: Globe,
    gradient: "from-purple-400 to-blue-400",
  },
  {
    title: "Onboard Community Members",
    description:
      "Set up automated workflows to welcome and engage new community members.",
    action: "Setup Onboarding",
    icon: UserPlus,
    gradient: "from-green-400 to-teal-400",
  },
];

export function ActionCards() {
  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-card border-border mx-4 rounded-2xl border p-4 lg:p-8"
    >
      <div className="mb-6 max-w-2xl lg:mb-8">
        <h3 className="text-foreground mb-3 text-xl font-semibold lg:mb-4 lg:text-2xl">
          Don&apos;t Have Community Members? No Worries
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed lg:text-base">
          We&apos;ll show you how to grow your community and add members
          quickly.
        </p>
      </div>

      <div className="space-y-3 lg:space-y-4">
        {actionCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            whileHover={{ x: 5 }}
            className="group"
          >
            <Card className="border-border hover:border-primary/20 cursor-pointer transition-all duration-300 hover:shadow-md">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {/* Icon and Content */}
                  <div className="flex min-w-0 flex-1 items-start gap-3 lg:gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        "bg-gradient-to-r",
                        card.gradient,
                        "transition-transform duration-300 group-hover:scale-110 lg:h-12 lg:w-12"
                      )}
                    >
                      <card.icon className="h-5 w-5 text-white lg:h-6 lg:w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-foreground group-hover:text-primary mb-1 text-sm font-semibold transition-colors duration-200 lg:text-base">
                        {card.title}
                      </h4>
                      <p className="text-muted-foreground text-xs leading-relaxed lg:text-sm">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-foreground bg-transparent text-xs whitespace-nowrap transition-all duration-200 lg:text-sm"
                    >
                      {card.action}
                    </Button>
                    <ChevronRight className="text-muted-foreground group-hover:text-primary hidden h-4 w-4 transition-all duration-200 group-hover:translate-x-1 sm:block" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
