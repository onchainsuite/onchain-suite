"use client";

import { Check } from "lucide-react";
import type React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MetricOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  group?: string;
}

interface MetricDropdownProps {
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  options: MetricOption[];
  groupedOptions?: Record<string, MetricOption[]>;
  label?: string;
}

export function MetricDropdown({
  selectedMetric,
  onMetricChange,
  options,
  groupedOptions,
  label = "Metric:",
}: MetricDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <Select value={selectedMetric} onValueChange={onMetricChange}>
        <SelectTrigger className="border-primary w-auto min-w-[140px] border-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {groupedOptions
            ? Object.entries(groupedOptions).map(
                ([groupName, groupOptions]) => (
                  <SelectGroup key={groupName}>
                    <SelectLabel>{groupName}</SelectLabel>
                    {groupOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {selectedMetric === option.value && (
                            <Check className="text-primary h-4 w-4" />
                          )}
                          {option.icon && <option.icon className="h-4 w-4" />}
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )
              )
            : options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {selectedMetric === option.value && (
                      <Check className="text-primary h-4 w-4" />
                    )}
                    {option.icon && <option.icon className="h-4 w-4" />}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
    </div>
  );
}
