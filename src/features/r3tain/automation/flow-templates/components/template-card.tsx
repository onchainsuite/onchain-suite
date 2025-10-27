"use client";

import { ArrowRight, Clock, Star, Zap } from "lucide-react";
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

import type { FlowTemplate } from "../types";

interface TemplateCardProps {
  template: FlowTemplate;
  index: number;
  onSelect: (template: FlowTemplate) => void;
}

export function TemplateCard({ template, index, onSelect }: TemplateCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 50);
    return () => clearTimeout(timer);
  }, [index]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Card
      className={`group flex cursor-pointer flex-col justify-between transition-all duration-500 hover:scale-[1.02] hover:shadow-lg ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      onClick={() => onSelect(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="text-2xl">{template.icon}</div>
          <div className="flex flex-wrap gap-1">
            {template.isPopular && (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
              >
                <Star className="mr-1 h-3 w-3" />
                Popular
              </Badge>
            )}
            {template.isRecommended && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
              >
                <Zap className="mr-1 h-3 w-3" />
                Recommended
              </Badge>
            )}
          </div>
        </div>

        <CardTitle className="group-hover:text-primary text-base leading-tight transition-colors">
          {template.title}
        </CardTitle>

        <CardDescription className="text-sm leading-relaxed">
          {template.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-0">
        <div className="flex-1 space-y-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {template.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Metadata */}
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{template.estimatedSetupTime}</span>
            </div>
            <Badge
              variant="secondary"
              className={getDifficultyColor(template.difficulty)}
            >
              {template.difficulty}
            </Badge>
          </div>

          {/* Features */}
          <div className="space-y-1">
            {template.features.slice(0, 2).map((feature) => (
              <div
                key={feature}
                className="text-muted-foreground flex items-center gap-2 text-xs"
              >
                <div className="bg-primary h-1 w-1 rounded-full" />
                <span>{feature}</span>
              </div>
            ))}
            {template.features.length > 2 && (
              <div className="text-muted-foreground text-xs">
                +{template.features.length - 2} more features
              </div>
            )}
          </div>

          {/* Spacer to push button down */}
          <div className="flex-grow" />
        </div>

        {/* Always-at-bottom Button */}
        <Button
          variant="ghost"
          className="group/btn text-primary hover:text-primary mt-4 w-full justify-between"
        >
          <span>Use this template</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
