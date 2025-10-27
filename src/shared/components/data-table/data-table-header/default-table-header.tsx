import { flexRender } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";

import { TableHead, TableHeader, TableRow } from "@/ui/table";

import { cn } from "@/lib/utils";

import type { DataTableHeaderProps } from "../types";

export function DefaultTableHeader<TData>({
  table,
}: DataTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="hover:bg-transparent">
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                style={{ width: `${header.getSize()}px` }}
                className="h-11"
              >
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <button
                    type="button"
                    className={cn(
                      header.column.getCanSort() &&
                        "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    onKeyDown={(e) => {
                      // Enhanced keyboard handling for sorting
                      if (
                        header.column.getCanSort() &&
                        (e.key === "Enter" || e.key === " ")
                      ) {
                        e.preventDefault();
                        header.column.getToggleSortingHandler()?.(e);
                      }
                    }}
                    tabIndex={header.column.getCanSort() ? 0 : undefined}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: (
                        <ChevronUp
                          className="shrink-0 opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                      ),
                      desc: (
                        <ChevronDown
                          className="shrink-0 opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                      ),
                    }[header.column.getIsSorted() as string] ?? null}
                  </button>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
