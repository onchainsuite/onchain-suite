"use client";

import { useState } from "react";

import type { Filter } from "@/r3tain/segment/types";

export function useFilterManagement() {
  const [filters, setFilters] = useState<Filter[]>([
    { id: "1", option: null, operator: "and", filterOperator: null, value: "" },
    { id: "2", option: null, operator: "or", filterOperator: null, value: "" },
  ]);

  const addFilter = () => {
    const newFilter: Filter = {
      id: Date.now().toString(),
      option: null,
      operator: "and",
      filterOperator: null,
      value: "",
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (filterId: string) => {
    if (filters.length > 1) {
      setFilters(filters.filter((f) => f.id !== filterId));
    }
  };

  const updateFilter = (filterId: string, updates: Partial<Filter>) => {
    setFilters(
      filters.map((f) => (f.id === filterId ? { ...f, ...updates } : f))
    );
  };

  const duplicateFilter = (filterId: string) => {
    const filterToDuplicate = filters.find((f) => f.id === filterId);
    if (filterToDuplicate) {
      const newFilter: Filter = {
        ...filterToDuplicate,
        id: Date.now().toString(),
      };
      const index = filters.findIndex((f) => f.id === filterId);
      const newFilters = [...filters];
      newFilters.splice(index + 1, 0, newFilter);
      setFilters(newFilters);
    }
  };

  return {
    filters,
    addFilter,
    removeFilter,
    updateFilter,
    duplicateFilter,
  };
}
