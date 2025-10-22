import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export function useDataTable<TData, TValue>({
  data,
  columns,
  initialSorting,
  pageSize = 10,
  facetColumns = [],
}: {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  initialSorting?: SortingState;
  pageSize?: number;
  facetColumns?: string[];
}) {
  const id = useId();
  const isInitial = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // State management
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>(initialSorting ?? []);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  useEffect(() => {
    isInitial.current = false;
  }, []);

  // Table initialization
  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (isInitial.current) return;
      setPagination(updater);
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    enableSortingRemoval: false,
  });

  // Faceted filter logic
  const facetOptions = useMemo(() => {
    return facetColumns.reduce(
      (acc, columnId) => {
        const column = table.getColumn(columnId);
        if (!column) return acc;

        const uniqueValues = column.getFacetedUniqueValues();
        acc[columnId] = Array.from(uniqueValues.entries())
          .map(([value, count]) => ({ value: String(value), count }))
          .sort((a, b) => a.value.localeCompare(b.value));

        return acc;
      },
      {} as Record<string, { value: string; count: number }[]>
    );
  }, [facetColumns, table]);

  const selectedFacetValues = useMemo(() => {
    return facetColumns.reduce(
      (acc, columnId) => {
        const filterValue = table
          .getColumn(columnId)
          ?.getFilterValue() as string[];
        acc[columnId] = filterValue || [];
        return acc;
      },
      {} as Record<string, string[]>
    );
  }, [facetColumns, table]);

  const handleFacetChange = (
    columnId: string,
    value: string,
    checked: boolean
  ) => {
    const currentFilter =
      (table.getColumn(columnId)?.getFilterValue() as string[]) || [];
    const newFilter = checked
      ? [...currentFilter, value]
      : currentFilter.filter((v) => v !== value);

    table
      .getColumn(columnId)
      ?.setFilterValue(newFilter.length ? newFilter : undefined);
  };

  return {
    id,
    table,
    inputRef,
    facetOptions,
    selectedFacetValues,
    handleFacetChange,
    // Expose state setters if needed
    setColumnFilters,
    setColumnVisibility,
    setPagination,
  };
}
