import type { Column } from "@tanstack/react-table";
import { Filter } from "lucide-react";

import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

interface DataTableFacetedFilterProps<TData, TValue> {
  id: string;
  filterKey: string;
  column?: Column<TData, TValue>;
  options?: {
    value: string;
    count: number;
  }[];
  selectedValues: string[];
  handleFacetedChange?: (
    filterKey: string,
    value: string,
    checked: boolean
  ) => void;
}

export const DataTableFacetedFilter = <TData, TValue>({
  id,
  column,
  filterKey,
  selectedValues,
  options,
  handleFacetedChange,
}: DataTableFacetedFilterProps<TData, TValue>) => {
  if (!column) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="capitalize">
          <Filter
            className="-ms-1 me-2 opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          {filterKey}
          {selectedValues.length > 0 && (
            <span className="border-border bg-background text-muted-foreground/70 ms-3 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
              {selectedValues.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-36 p-3" align="start">
        <div className="space-y-3">
          <div className="text-muted-foreground text-xs font-medium">
            Filters
          </div>
          <div className="space-y-3">
            {options?.map((option, i) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`${id}-${filterKey}-${i}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked: boolean) =>
                    handleFacetedChange?.(filterKey, option.value, checked)
                  }
                />
                <Label
                  htmlFor={`${id}-${filterKey}-${i}`}
                  className="flex grow justify-between gap-2 font-normal"
                >
                  {option.value}
                  <span className="text-muted-foreground ms-2 text-xs">
                    {option.count}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
