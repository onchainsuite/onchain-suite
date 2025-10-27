import { flexRender } from "@tanstack/react-table";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  PinOff,
} from "lucide-react";

import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { TableHead, TableHeader, TableRow } from "@/ui/table";

import { cn, getPinningStyles } from "@/lib/utils";

import type { DataTableHeaderProps, DataTableTitleHeaderProps } from "../types";

const DataTableTitleHeader = <TData, TValue>({
  header,
}: DataTableTitleHeaderProps<TData, TValue>) => {
  const { column } = header;
  const isPinned = column.getIsPinned();
  const isLastLeftPinned =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinned =
    isPinned === "right" && column.getIsFirstColumn("right");

  return (
    <TableHead
      className={cn(
        "relative h-10 truncate border-t select-none",
        // Pinning-specific classes
        "data-[pinned=left]:border-r",
        "data-[pinned=right]:border-l",
        "data-pinned:bg-muted/90",
        "data-pinned:backdrop-blur-sm",
        // Resize handle opacity logic
        "[&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0",
        "[&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0",
        "[&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0"
      )}
      style={{ ...getPinningStyles(column) }}
      colSpan={header.colSpan}
      data-pinned={isPinned ?? undefined}
      data-last-col={
        isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
      }
      aria-sort={
        header.column.getIsSorted() === "asc"
          ? "ascending"
          : header.column.getIsSorted() === "desc"
            ? "descending"
            : "none"
      }
    >
      <div className="flex items-center justify-between gap-2">
        {/* Sorting and Column Content */}
        <div
          className={cn(
            "grow truncate",
            column.getCanSort() &&
              "flex cursor-pointer items-center gap-2 select-none"
          )}
          onClick={column.getToggleSortingHandler()}
          onKeyDown={(e) => {
            if (column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              column.getToggleSortingHandler()?.(e);
            }
          }}
          tabIndex={column.getCanSort() ? 0 : undefined}
          role={column.getCanSort() ? "button" : undefined}
        >
          <span className="truncate">
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </span>

          {/* Sorting Indicators */}
          {{
            asc: (
              <ChevronUp
                className="shrink-0 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            ),
            desc: (
              <ChevronDown
                className="shrink-0 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            ),
          }[column.getIsSorted() as string] ?? null}
        </div>

        {/* Pin/Unpin Column Controls */}
        {column.getCanPin() &&
          (column.getIsPinned() ? (
            <Button
              size="icon"
              variant="ghost"
              className="-mr-1 size-7 shadow-none"
              onClick={() => column.pin(false)}
              aria-label={`Unpin ${column.columnDef.header as string} column`}
              title={`Unpin ${column.columnDef.header as string} column`}
            >
              <PinOff
                className="opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="-mr-1 size-7 shadow-none"
                  aria-label={`Pin options for ${column.id} column`}
                  title={`Pin options for ${column.id} column`}
                >
                  <Ellipsis
                    className="opacity-60"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => column.pin("left")}>
                  <ArrowLeftToLine
                    size={16}
                    strokeWidth={2}
                    className="mr-2 opacity-60"
                    aria-hidden="true"
                  />
                  Stick to left
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.pin("right")}>
                  <ArrowRightToLine
                    size={16}
                    strokeWidth={2}
                    className="mr-2 opacity-60"
                    aria-hidden="true"
                  />
                  Stick to right
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}

        {/* Resize Handle */}
        {column.getCanResize() && (
          <div
            {...{
              onDoubleClick: () => column.resetSize(),
              onMouseDown: header.getResizeHandler(),
              onTouchStart: header.getResizeHandler(),
              className:
                "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
            }}
          />
        )}
      </div>
    </TableHead>
  );
};

export function ResizableTableHeader<TData>({
  table,
}: DataTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="bg-muted/50">
          {headerGroup.headers.map((header) => (
            <DataTableTitleHeader key={header.id} header={header} />
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}
