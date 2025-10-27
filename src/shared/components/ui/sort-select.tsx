"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SortOption[];
  className?: string;
}

export function SortSelect({
  value,
  onValueChange,
  options,
  className,
}: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={`hover:bg-muted/50 w-auto border-0 bg-transparent transition-colors ${className}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
