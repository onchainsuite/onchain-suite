import type { ColumnDef, Header, Table } from "@tanstack/react-table";

export interface DataTableTitleHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
}

export interface DataTableHeaderProps<TData> {
  table: Table<TData>;
}

export interface DataTableBodyProps<TData> {
  table: Table<TData>;
  columns: ColumnDef<TData>[];
}
