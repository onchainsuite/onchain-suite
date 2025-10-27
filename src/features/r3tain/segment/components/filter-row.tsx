"use client";

import {
  Activity,
  Copy,
  Mail,
  MessageCircle,
  Tag,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FilterValueInput } from "./filter-value-input";
import {
  getFilterConfiguration,
  groupedFilterOptions,
} from "@/r3tain/segment/data";
import type { Filter } from "@/r3tain/segment/types";

interface FilterRowProps {
  filter: Filter;
  onUpdate: (updates: Partial<Filter>) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  canRemove: boolean;
}

const categoryIcons = {
  "How your contacts are tagged": Tag,
  "Contact details": User,
  "How your contacts were acquired": User,
  "Email & Automation Activity": Mail,
  "Other activity": Activity,
  "Conversations activity": MessageCircle,
};

export function FilterRow({
  filter,
  onUpdate,
  onDuplicate,
  onRemove,
  canRemove,
}: FilterRowProps) {
  const filterConfig = filter.option
    ? getFilterConfiguration(filter.option.id)
    : null;
  const availableOperators = filterConfig?.operators ?? [];

  return (
    <div className="flex-1 space-y-3">
      <div className="bg-accent flex items-center justify-between gap-3 rounded-md p-4">
        <div className="flex items-center gap-3">
          <Select
            value={filter.option?.id ?? ""}
            onValueChange={(value) => {
              const option = Object.values(groupedFilterOptions)
                .flat()
                .find((opt) => opt.id === value);
              onUpdate({
                option,
                filterOperator: null,
                value: "",
                secondaryValue: undefined,
              });
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select or search a filter" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {Object.entries(groupedFilterOptions).map(
                ([category, options]) => {
                  const IconComponent =
                    categoryIcons[category as keyof typeof categoryIcons] ||
                    User;
                  return (
                    <div key={category}>
                      <div className="text-muted-foreground flex items-center gap-2 px-2 py-1.5 text-sm font-medium">
                        <IconComponent className="h-4 w-4" />
                        {category}
                      </div>
                      {options.map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.id}
                          className="pl-8"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </div>
                  );
                }
              )}
            </SelectContent>
          </Select>

          {filter.option && availableOperators.length > 0 && (
            <Select
              value={filter.filterOperator?.id ?? ""}
              onValueChange={(value) => {
                const operator = availableOperators.find(
                  (op) => op.id === value
                );
                onUpdate({
                  filterOperator: operator ?? null,
                  value: operator?.inputType === "multiselect" ? [] : "",
                  secondaryValue: undefined,
                });
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {availableOperators.map((operator) => (
                  <SelectItem key={operator.id} value={operator.id}>
                    {operator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {filter.filterOperator && filter.filterOperator.requiresValue && (
            <div className="ml-0">
              <FilterValueInput filter={filter} onUpdate={onUpdate} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-muted h-8 w-8 p-0"
            onClick={onDuplicate}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-muted h-8 w-8 p-0"
            onClick={onRemove}
            disabled={!canRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
