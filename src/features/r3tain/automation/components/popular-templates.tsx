"use client";

import { ArrowRight, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { AutomationTemplate } from "../types";

interface PopularTemplatesProps {
  templates: AutomationTemplate[];
}

export function PopularTemplates({ templates }: PopularTemplatesProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const cardsToShow = showAll ? templates : templates.slice(0, 6);
    setVisibleCards([]);

    cardsToShow.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, index]);
      }, index * 100);
    });
  }, [templates, showAll]);

  const displayedTemplates = showAll ? templates : templates.slice(0, 6);

  return (
    <section className="bg-muted/30 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            <TrendingUp className="h-4 w-4" />
            Most popular
          </div>
          <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
            Popular flow templates
          </h2>
          <p className="text-muted-foreground mt-2">
            You are on the Free Plan. Enjoy a preview of Pre-Built Customer
            Journeys, then{" "}
            <Button variant="link" className="text-primary h-auto p-0">
              upgrade
            </Button>{" "}
            to launch them.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedTemplates.map((template, index) => (
            <Card
              key={template.id}
              className={`group cursor-pointer transition-all duration-500 hover:shadow-md ${
                visibleCards.includes(index)
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="text-xl">{template.icon}</div>
                  {template.isPopular && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                    >
                      <Star className="mr-1 h-3 w-3" />
                      Popular
                    </Badge>
                  )}
                </div>
                <CardTitle className="group-hover:text-primary text-base leading-tight transition-colors">
                  {template.title}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {template.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {!showAll && templates.length > 6 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(true)}
              className="group"
            >
              See all flow templates
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
