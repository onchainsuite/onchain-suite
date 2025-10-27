"use client";

import { ChevronDown, Filter, X } from "lucide-react";
import Link from "next/link";
import { type JSX, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { FILTER_BADGE_LABELS, FILTER_CONFIGS } from "./constants";
import type { FilterConfig, Filters, FiltersBarProps } from "./types";

export function FiltersBar({ filters, onFiltersChange }: FiltersBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const updateArrayFilter = (key: Filters, value: string, checked: boolean) => {
    const currentValues = filters[key] as string[];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v) => v !== value);
    }

    onFiltersChange({
      ...filters,
      [key]: newValues,
    });
  };

  const removeFilterValue = (key: Filters, value: string) => {
    const currentValues = filters[key] as string[];
    onFiltersChange({
      ...filters,
      [key]: currentValues.filter((v) => v !== value),
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      segments: [],
      subscriptionStatus: [],
      tags: [],
      signupSource: [],
      search: "",
      advancedFilters: {},
    });
  };

  const hasActiveFilters =
    filters.segments.length > 0 ||
    filters.subscriptionStatus.length > 0 ||
    filters.tags.length > 0 ||
    filters.signupSource.length > 0 ||
    filters.search !== "" ||
    Object.keys(filters.advancedFilters).length > 0;

  const getButtonLabel = (filterArray: string[], defaultLabel: string) => {
    if (filterArray.length === 0) return defaultLabel;
    if (filterArray.length === 1) return filterArray[0];
    return `${filterArray.length} selected`;
  };

  const hasActiveFilter = (filterArray: string[]) => filterArray.length > 0;

  // Reusable Filter Dropdown Component
  const FilterDropdown = ({ config }: { config: FilterConfig }) => {
    const currentValues = filters[config.key] as string[];
    const isActive = hasActiveFilter(currentValues);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`${config.minWidth} justify-between ${
              isActive ? "border-primary bg-primary/10 text-primary" : ""
            }`}
          >
            {getButtonLabel(currentValues, config.label)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {config.hasSearch && (
            <>
              <div className="p-2">
                <Input
                  placeholder={`Search ${config.label.toLowerCase()}...`}
                  className="mb-2"
                />
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {!config.hasSearch && (
            <>
              <DropdownMenuLabel>
                {config.key === "subscriptionStatus"
                  ? "Email Status"
                  : config.label}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}

          {config.options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={currentValues.includes(option.value)}
              onCheckedChange={(checked) =>
                updateArrayFilter(config.key, option.value, checked)
              }
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}

          {config.manageOption && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-primary cursor-pointer" asChild>
                <Link href={config.manageOptionUrl ?? "#"}>
                  {config.manageOption}
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Reusable Filter Badge Component
  const FilterBadge = ({
    filterKey,
    value,
  }: {
    filterKey: Filters;
    value: string;
  }) => (
    <Badge key={`${filterKey}-${value}`} variant="secondary" className="gap-1">
      {FILTER_BADGE_LABELS[filterKey]}: {value}
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-destructive/10 h-auto w-auto p-0.5"
        onClick={() => removeFilterValue(filterKey, value)}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );

  // Render all active filter badges
  const renderActiveFilterBadges = () => {
    const badges: JSX.Element[] = [];

    // Iterate through filter configurations to render badges
    FILTER_CONFIGS.forEach((config) => {
      const values = filters[config.key] as string[];
      values.forEach((value) => {
        badges.push(
          <FilterBadge
            key={`${config.key}-${value}`}
            filterKey={config.key}
            value={value}
          />
        );
      });
    });

    return badges;
  };

  return (
    <div className="space-y-4">
      {/* Main Filters Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        {/* Render all filter dropdowns */}
        {FILTER_CONFIGS.map((config) => (
          <FilterDropdown key={config.key} config={config} />
        ))}

        {/* Advanced Filters */}
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={
            hasActiveFilters ? "border-primary bg-primary/10 text-primary" : ""
          }
        >
          <Filter className="mr-2 h-4 w-4" />
          Advanced filters
        </Button>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {renderActiveFilterBadges()}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
