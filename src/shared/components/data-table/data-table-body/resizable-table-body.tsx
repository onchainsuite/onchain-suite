import { type Cell, flexRender } from "@tanstack/react-table";

import { TableBody, TableCell, TableRow } from "@/ui/table";

import { getPinningStyles } from "@/lib/utils";

import type { DataTableBodyProps } from "../types";

interface TableBodyCellProps<TData, TValue> {
  cell: Cell<TData, TValue>;
}

const TableBodyCell = <TData, TValue>({
  cell,
}: TableBodyCellProps<TData, TValue>) => {
  const { column } = cell;
  const isPinned = column.getIsPinned();
  const isLastLeftPinned =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinned =
    isPinned === "right" && column.getIsFirstColumn("right");

  return (
    <TableCell
      className="[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 truncate [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l data-pinned:backdrop-blur-sm"
      style={{ ...getPinningStyles(column) }}
      data-pinned={isPinned ?? undefined}
      data-last-col={
        isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
      }
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

export const ResizableTableBody = <TData,>({
  table,
  columns,
}: DataTableBodyProps<TData>) => {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableBodyCell key={cell.id} cell={cell} />
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};
