"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import { SortOrderToggle } from "@/ui/sort-order-toggle";
import { SortSelect } from "@/ui/sort-select";

interface BulkSelectHeaderProps {
  allSelected: boolean;
  someSelected: boolean;
  selectedCount: number;
  sortBy: string;
  sortOrder: "asc" | "desc"; // Added sort order prop
  onSelectAll: (checked: boolean) => void;
  onSortChange: (value: string) => void;
  onSortOrderChange: (order: "asc" | "desc") => void; // Added sort order change handler
  onDelete?: () => void;
}

const sortOptions = [
  { value: "date-created", label: "Sort by Date created" },
  { value: "name", label: "Sort by Name" },
  { value: "usage", label: "Sort by Usage" },
];

export function BulkSelectHeader({
  allSelected,
  selectedCount,
  sortBy,
  sortOrder, // Added sort order
  onSelectAll,
  onSortChange,
  onSortOrderChange, // Added sort order change handler
  onDelete,
}: BulkSelectHeaderProps) {
  return (
    <div className="border-border flex flex-col gap-4 border-b py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center space-x-2">
        {" "}
        {/* Reduced space between items */}
        <Checkbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <div className="flex items-center">
          {" "}
          {/* Added wrapper for sort controls */}
          <SortSelect
            value={sortBy}
            onValueChange={onSortChange}
            options={sortOptions}
          />
          <SortOrderToggle
            order={sortOrder}
            onOrderChange={onSortOrderChange}
            className="ml-1"
          />
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="animate-in slide-in-from-right-5 flex items-center space-x-2 duration-200">
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
