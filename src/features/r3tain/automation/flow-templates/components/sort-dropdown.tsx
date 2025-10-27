"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type TemplateSortOption } from "../types";

interface SortOption {
  id: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  selectedValue: TemplateSortOption;
  onSelectionChange: (value: TemplateSortOption) => void;
}

export function SortDropdown({
  options,
  selectedValue,
  onSelectionChange,
}: SortDropdownProps) {
  // const selectedOption = options.find(opt => opt.id === selectedValue);

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm font-medium whitespace-nowrap">
        Sort By:
      </span>
      <Select value={selectedValue} onValueChange={onSelectionChange}>
        <SelectTrigger className="border-primary text-primary h-8 w-auto min-w-24 text-sm font-normal">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
