"use client";

import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
}

export function FilterDropdown({
  label,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "All",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (optionId: string) => {
    const newSelection = selectedValues.includes(optionId)
      ? selectedValues.filter((id) => id !== optionId)
      : [...selectedValues, optionId];

    onSelectionChange(newSelection);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const displayText =
    selectedValues.length === 0
      ? placeholder
      : selectedValues.length === 1
        ? (options.find((opt) => opt.id === selectedValues[0])?.label ??
          placeholder)
        : `${selectedValues.length} selected`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-medium">
          {label}:
        </span>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-8 justify-between gap-2 text-sm font-normal"
              size="sm"
            >
              <span
                className={
                  selectedValues.length === 0
                    ? "text-muted-foreground"
                    : "text-primary"
                }
              >
                {displayText}
              </span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <div className="max-h-64 overflow-y-auto">
              <div className="space-y-2 p-3">
                {selectedValues.length > 0 && (
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground text-xs">
                      {selectedValues.length} selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAll}
                      className="h-6 px-2 text-xs"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
                {options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={selectedValues.includes(option.id)}
                      onCheckedChange={() => handleToggle(option.id)}
                    />
                    <Label
                      htmlFor={option.id}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected items as badges on mobile */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:hidden">
          {selectedValues.slice(0, 3).map((value) => {
            const option = options.find((opt) => opt.id === value);
            return (
              <Badge
                key={value}
                variant="secondary"
                className="gap-1 px-2 py-1 text-xs"
              >
                {option?.label}
                <button
                  onClick={() => handleToggle(value)}
                  className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            );
          })}
          {selectedValues.length > 3 && (
            <Badge variant="secondary" className="px-2 py-1 text-xs">
              +{selectedValues.length - 3} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
