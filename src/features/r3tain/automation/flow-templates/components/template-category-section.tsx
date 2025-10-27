"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";

import type { FlowTemplate, TemplateCategory } from "../types";
import { TemplateCard } from "./template-card";

interface TemplateCategorySectionProps {
  category: TemplateCategory;
  onTemplateSelect: (template: FlowTemplate) => void;
  sectionIndex: number;
}

export function TemplateCategorySection({
  category,
  onTemplateSelect,
  sectionIndex,
}: TemplateCategorySectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), sectionIndex * 200);
    return () => clearTimeout(timer);
  }, [sectionIndex]);

  const getCategoryBadge = (categoryId: string) => {
    switch (categoryId) {
      case "recommended":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            Recommended for you
          </Badge>
        );
      case "find-welcome":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Grow your audience
          </Badge>
        );
      case "nurture-leads":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
            Convert prospects
          </Badge>
        );
      case "re-engage":
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
            Win back customers
          </Badge>
        );
      case "support-manage":
        return (
          <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400">
            Customer success
          </Badge>
        );
      case "transactional":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
            Essential emails
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <section
      className={`transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-foreground text-xl font-bold">{category.name}</h2>
          {getCategoryBadge(category.id)}
        </div>
        <p className="text-muted-foreground text-sm">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {category.templates.map((template, index) => (
          <TemplateCard
            key={template.id}
            template={template}
            index={index}
            onSelect={onTemplateSelect}
          />
        ))}
      </div>
    </section>
  );
}
