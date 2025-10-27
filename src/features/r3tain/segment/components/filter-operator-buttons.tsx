"use client";

import { Button } from "@/components/ui/button";

import type { Filter } from "@/r3tain/segment/types";

interface FilterOperatorButtonsProps {
  filter: Filter;
  onUpdate: (updates: Partial<Filter>) => void;
}

export function FilterOperatorButtons({
  filter,
  onUpdate,
}: FilterOperatorButtonsProps) {
  return (
    <div className="ml-4 flex items-center gap-2">
      <Button
        variant={filter.operator === "and" ? "default" : "outline"}
        size="sm"
        className="h-7 px-3 text-xs"
        onClick={() => onUpdate({ operator: "and" })}
      >
        And
      </Button>
      <Button
        variant={filter.operator === "or" ? "default" : "outline"}
        size="sm"
        className="h-7 px-3 text-xs"
        onClick={() => onUpdate({ operator: "or" })}
      >
        Or
      </Button>
    </div>
  );
}
