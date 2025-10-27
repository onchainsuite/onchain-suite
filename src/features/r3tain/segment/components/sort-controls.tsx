"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SortOption, SortOrder } from "@/r3tain/segment/types";

interface SortControlsProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSortChange: (sort: SortOption) => void;
  onSortOrderChange: (order: SortOrder) => void;
  isAllSelected: boolean;
  onSelectAll: () => void;
  hasSelection: boolean;
  onDelete: () => void;
}

export function SortControls({
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  isAllSelected,
  onSelectAll,
  hasSelection,
  onDelete,
}: SortControlsProps) {
  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
  };

  const getSortIcon = () => {
    if (sortOrder === "asc") return <ArrowUp className="h-4 w-4" />;
    if (sortOrder === "desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span>Sort by</span>
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <SelectTrigger className="h-auto w-auto border-0 bg-transparent p-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-added">Date added</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-muted h-auto p-1"
            onClick={toggleSortOrder}
            title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
          >
            {getSortIcon()}
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-destructive"
        disabled={!hasSelection}
        onClick={onDelete}
      >
        Delete
      </Button>
    </div>
  );
}
