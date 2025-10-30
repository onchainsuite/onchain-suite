"use client";

import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { TemplateFilters, TemplateSortOption } from "../types";
import { FilterDropdown } from "./filter-dropdown";
import { SortDropdown } from "./sort-dropdown";
import {
  appsIntegrationsOptions,
  channelOptions,
  sortOptions,
  topicOptions,
} from "@/3ridge/event/data";

interface TemplatesHeaderProps {
  filters: TemplateFilters;
  onFiltersChange: (filters: TemplateFilters) => void;
  totalTemplates: number;
}

export function TemplatesHeader({
  filters,
  onFiltersChange,
  totalTemplates,
}: TemplatesHeaderProps) {
  const hasActiveFilters =
    filters.channels.length > 0 ||
    filters.topics.length > 0 ||
    filters.appsIntegrations.length > 0 ||
    filters.search;

  const clearAllFilters = () => {
    onFiltersChange({
      channels: [],
      topics: [],
      appsIntegrations: [],
      sortBy: "popular",
      search: "",
    });
  };

  return (
    <div className="border-border bg-card/50 top-0 z-10 border-b p-4 backdrop-blur-sm sm:sticky">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">
              Flow templates
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Choose from pre-built automation templates to get started quickly
            </p>
          </div>

          <Button className="group">
            <Plus className="mr-2 h-4 w-4" />
            Build from scratch
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search templates..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center lg:flex-1">
            <FilterDropdown
              label="Channels"
              options={channelOptions}
              selectedValues={filters.channels}
              onSelectionChange={(values) =>
                onFiltersChange({ ...filters, channels: values })
              }
            />

            <FilterDropdown
              label="Topics"
              options={topicOptions}
              selectedValues={filters.topics}
              onSelectionChange={(values) =>
                onFiltersChange({ ...filters, topics: values })
              }
            />

            <FilterDropdown
              label="Apps & Integrations"
              options={appsIntegrationsOptions}
              selectedValues={filters.appsIntegrations}
              onSelectionChange={(values) =>
                onFiltersChange({ ...filters, appsIntegrations: values })
              }
            />

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all filters
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="text-muted-foreground text-sm whitespace-nowrap">
              {totalTemplates} template{totalTemplates !== 1 ? "s" : ""} found
            </div>

            <SortDropdown
              options={sortOptions}
              selectedValue={filters.sortBy}
              onSelectionChange={(value: TemplateSortOption) =>
                onFiltersChange({ ...filters, sortBy: value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
