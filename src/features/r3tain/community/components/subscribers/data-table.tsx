"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TablePagination } from "./pagination";
import { TableActions } from "./table-actions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  onRowSelectionChange,
  onExportCSV,
  onExportPDF,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, onRowSelectionChange, table]);

  return (
    <>
      {/* Table Actions */}
      <TableActions
        onExportCSV={onExportCSV}
        onExportPDF={onExportPDF}
        table={table}
      />
      <div className="w-full">
        {/* Search Bar */}
        <div className="flex items-center py-4">
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table with Fixed Columns */}
        <div className="rounded-md border">
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => {
                      const isFixed = index === 0 || index === 1; // checkbox and email columns
                      return (
                        <TableHead
                          key={header.id}
                          className={` ${isFixed ? "bg-background sticky z-10" : ""} ${index === 0 ? "left-0" : ""} ${index === 1 ? "left-12" : ""} min-w-[120px]`}
                          style={{
                            minWidth: index === 1 ? "250px" : "120px", // email column wider
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        const isFixed = index === 0 || index === 1; // checkbox and email columns
                        return (
                          <TableCell
                            key={cell.id}
                            className={` ${isFixed ? "bg-background sticky z-10" : ""} ${index === 0 ? "left-0" : ""} ${index === 1 ? "left-12" : ""} max-h-[60px] overflow-hidden`}
                            style={{
                              minWidth: index === 1 ? "250px" : "120px",
                              maxWidth: index === 1 ? "300px" : "200px",
                            }}
                          >
                            <div className="line-clamp-2">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <TablePagination table={table} />
      </div>
    </>
  );
}
