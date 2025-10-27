"use client";

import { ArrowRight, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { AutomationTemplate } from "../types";

interface RecommendedFlowsProps {
  flows: AutomationTemplate[];
}

export function RecommendedFlows({ flows }: RecommendedFlowsProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    flows.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, index]);
      }, index * 150);
    });
  }, [flows]);

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
            <Zap className="h-4 w-4" />
            Recommended for you
          </div>
          <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
            Try these recommended flows
          </h2>
          <p className="text-muted-foreground mt-2">
            Some of these automation templates include generated email content
            that&apos;s personalized for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {flows.map((flow, index) => (
            <Card
              key={flow.id}
              className={`group hover:border-primary relative overflow-hidden border-2 transition-all duration-500 hover:shadow-lg ${
                visibleCards.includes(index)
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="text-2xl">{flow.icon}</div>
                  {flow.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="group-hover:text-primary text-lg transition-colors">
                  {flow.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {flow.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <Button
                  variant="ghost"
                  className="group/btn text-primary hover:text-primary h-auto w-full justify-between p-0"
                >
                  <span>Get started</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>

              {/* Hover Effect */}
              <div className="from-primary/5 absolute inset-0 -z-10 bg-gradient-to-br to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
