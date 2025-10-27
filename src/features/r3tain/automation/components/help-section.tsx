"use client";

import {
  ArrowRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Play,
} from "lucide-react";
import Image from "next/image";
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

import type { HelpResource } from "../types";

interface HelpSectionProps {
  resources: HelpResource[];
}

export function HelpSection({ resources }: HelpSectionProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    resources.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, index]);
      }, index * 200);
    });
  }, [resources]);

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-5 w-5" />;
      case "guide":
        return <BookOpen className="h-5 w-5" />;
      case "tutorial":
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <HelpCircle className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "guide":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "tutorial":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
            <HelpCircle className="h-4 w-4" />
            Need some help?
          </div>
          <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
            Get started with automation
          </h2>
          <p className="text-muted-foreground mt-2">
            Learn how to create powerful automated workflows for your business
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <Card
              key={resource.id}
              className={`group overflow-hidden transition-all duration-500 hover:shadow-lg ${
                visibleCards.includes(index)
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="aspect-video overflow-hidden">
                <Image
                  src={resource.image || "/placeholder.svg"}
                  alt={resource.title}
                  width={500}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <CardHeader className="pb-3">
                <div className="mb-2 flex items-center gap-2">
                  {getIcon(resource.type)}
                  <Badge
                    variant="secondary"
                    className={getTypeColor(resource.type)}
                  >
                    {resource.category}
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-primary text-lg transition-colors">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {resource.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <Button
                  variant="ghost"
                  className="group/btn text-primary hover:text-primary h-auto w-full justify-between p-0"
                >
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
