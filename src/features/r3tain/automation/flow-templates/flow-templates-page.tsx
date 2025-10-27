/* eslint-disable no-console */
"use client";

import { useMemo, useState } from "react";

import { TemplateCategorySection, TemplatesHeader } from "./components";
import { templateCategories } from "./data";
import type { FlowTemplate, TemplateFilters } from "./types";

export function FlowTemplatesPage() {
  const [filters, setFilters] = useState<TemplateFilters>({
    channels: [],
    topics: [],
    appsIntegrations: [],
    sortBy: "popular",
    search: "",
  });

  // Filter categories and templates based on current filters
  const filteredCategories = useMemo(() => {
    let allTemplates = templateCategories.flatMap((category) =>
      category.templates.map((template) => ({
        ...template,
        categoryName: category.name,
      }))
    );

    // Apply filters
    allTemplates = allTemplates.filter((template) => {
      // Channel filter
      if (filters.channels.length > 0) {
        const hasMatchingChannel = filters.channels.some((channel) =>
          template.channels.includes(channel)
        );
        if (!hasMatchingChannel) return false;
      }

      // Topics filter
      if (filters.topics.length > 0) {
        const hasMatchingTopic = filters.topics.some((topic) =>
          template.topics.includes(topic)
        );
        if (!hasMatchingTopic) return false;
      }

      // Apps & Integrations filter
      if (filters.appsIntegrations.length > 0) {
        const hasMatchingIntegration = filters.appsIntegrations.some(
          (integration) => template.integrations.includes(integration)
        );
        if (!hasMatchingIntegration) return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          template.title.toLowerCase().includes(searchTerm) ||
          template.description.toLowerCase().includes(searchTerm) ||
          template.tags.some((tag) => tag.toLowerCase().includes(searchTerm));
        if (!matchesSearch) return false;
      }

      return true;
    });

    // Apply sorting
    allTemplates.sort((a, b) => {
      switch (filters.sortBy) {
        case "popular":
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        case "newest":
          return b.id.localeCompare(a.id); // Assuming newer templates have higher IDs
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "recommended":
          return (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0);
        default:
          return 0;
      }
    });

    // Group back into categories
    const categoriesMap = new Map();
    allTemplates.forEach((template) => {
      const { categoryName } = template;
      if (!categoriesMap.has(categoryName)) {
        const originalCategory = templateCategories.find(
          (cat) => cat.name === categoryName
        );
        categoriesMap.set(categoryName, {
          ...originalCategory,
          templates: [],
        });
      }
      categoriesMap.get(categoryName).templates.push(template);
    });

    return Array.from(categoriesMap.values()).filter(
      (category) => category.templates.length > 0
    );
  }, [filters]);

  const totalTemplates = filteredCategories.reduce(
    (total, category) => total + category.templates.length,
    0
  );

  const handleTemplateSelect = (template: FlowTemplate) => {
    console.log("Selected template:", template);
    // Here you would typically navigate to the template setup page
    // or open a modal with template details
  };

  return (
    <div className="space-y-8">
      <TemplatesHeader
        filters={filters}
        onFiltersChange={setFilters}
        totalTemplates={totalTemplates}
      />

      <div className="mx-auto max-w-6xl p-4">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold">No templates found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search criteria or filters to find more
              templates.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredCategories.map((category, index) => (
              <TemplateCategorySection
                key={category.id}
                category={category}
                onTemplateSelect={handleTemplateSelect}
                sectionIndex={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
