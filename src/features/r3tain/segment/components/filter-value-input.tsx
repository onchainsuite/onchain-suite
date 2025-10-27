"use client";

import { Calendar } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Filter } from "@/r3tain/segment/types";

interface FilterValueInputProps {
  filter: Filter;
  onUpdate: (updates: Partial<Filter>) => void;
}

export function FilterValueInput({ filter, onUpdate }: FilterValueInputProps) {
  if (!filter.filterOperator?.requiresValue) {
    return null;
  }

  const { inputType, placeholder, options } = filter.filterOperator;

  switch (inputType) {
    case "text":
      return (
        <Input
          placeholder={placeholder}
          value={filter.value as string}
          onChange={(e) => onUpdate({ value: e.target.value })}
          className="flex-1"
        />
      );

    case "number":
      return (
        <Input
          type="number"
          placeholder={placeholder}
          value={filter.value as string}
          onChange={(e) => onUpdate({ value: e.target.value })}
          className="flex-1"
          min={filter.filterOperator.validation?.min}
          max={filter.filterOperator.validation?.max}
        />
      );

    case "date":
      return (
        <div className="flex flex-1 items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <Input
            type="date"
            value={filter.value as string}
            onChange={(e) => onUpdate({ value: e.target.value })}
            className="flex-1"
          />
        </div>
      );

    case "select":
      return (
        <Select
          value={filter.value as string}
          onValueChange={(value) => onUpdate({ value })}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={placeholder ?? "Select option"} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "multiselect":
      return (
        <div className="flex-1 space-y-2">
          <div className="text-muted-foreground text-sm">
            Select multiple options:
          </div>
          <div className="max-h-32 space-y-2 overflow-y-auto">
            {options?.map((option) => {
              const values = Array.isArray(filter.value) ? filter.value : [];
              const isChecked = values.includes(option);
              return (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${filter.id}-${option}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(filter.value)
                        ? filter.value
                        : [];
                      const newValues = checked
                        ? [...currentValues, option]
                        : currentValues.filter((v) => v !== option);
                      onUpdate({ value: newValues });
                    }}
                  />
                  <label htmlFor={`${filter.id}-${option}`} className="text-sm">
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "distance":
      return (
        <div className="flex flex-1 gap-2">
          <Input
            type="number"
            placeholder="Miles"
            value={filter.value as string}
            onChange={(e) => onUpdate({ value: e.target.value })}
            className="w-24"
          />
          <Input
            placeholder="Zip code"
            value={filter.secondaryValue ?? ""}
            onChange={(e) => onUpdate({ secondaryValue: e.target.value })}
            className="flex-1"
          />
        </div>
      );

    case "location":
      return (
        <div className="flex flex-1 gap-2">
          <Input
            type="number"
            placeholder="Miles"
            value={filter.value as string}
            onChange={(e) => onUpdate({ value: e.target.value })}
            className="w-24"
          />
          <Input
            placeholder="Location"
            value={filter.secondaryValue ?? ""}
            onChange={(e) => onUpdate({ secondaryValue: e.target.value })}
            className="flex-1"
          />
        </div>
      );

    default:
      return (
        <Input
          placeholder={placeholder}
          value={filter.value as string}
          onChange={(e) => onUpdate({ value: e.target.value })}
          className="flex-1"
        />
      );
  }
}
