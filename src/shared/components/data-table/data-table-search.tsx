import type { Table } from "@tanstack/react-table";
import { CircleX, ListFilter } from "lucide-react";
import type { RefObject } from "react";

import { Input } from "@/ui/input";

import { cn } from "@/lib/utils";

interface DataTableSearchProps<TData> {
  table: Table<TData>;
  inputRef: RefObject<HTMLInputElement | null>;
  id: string;
  placeholder: string;
  filterColumn?: string; // New prop for dynamic column filtering
}

export const DataTableSearch = <TData,>({
  table,
  inputRef,
  id,
  placeholder,
  filterColumn = "name", // Default to "name" if not provided
}: DataTableSearchProps<TData>) => {
  return (
    <div className="relative w-full">
      <Input
        id={`${id}-input`}
        ref={inputRef}
        className={cn(
          "w-ful peer min-w-60 ps-9",
          Boolean(table.getColumn(filterColumn)?.getFilterValue()) && "pe-9"
        )}
        value={
          (table.getColumn(filterColumn)?.getFilterValue() ?? "") as string
        }
        onChange={(e) =>
          table.getColumn(filterColumn)?.setFilterValue(e.target.value)
        }
        placeholder={placeholder}
        type="text"
        aria-label={placeholder}
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <ListFilter size={16} strokeWidth={2} aria-hidden="true" />
      </div>
      {Boolean(table.getColumn(filterColumn)?.getFilterValue()) && (
        <button
          type="button"
          className="text-muted-foreground/80 hover:text-foreground focus-visible:outline-ring/70 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg outline-offset-2 transition-colors focus:z-10 focus-visible:outline-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear filter"
          onClick={() => {
            table.getColumn(filterColumn)?.setFilterValue("");
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          <CircleX size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
