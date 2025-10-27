import { type Table } from "@tanstack/react-table";

import { type SubscriberFilters } from "@/r3tain/community/types";

export interface FiltersBarProps {
  filters: SubscriberFilters;
  onFiltersChange: (filters: SubscriberFilters) => void;
}

export type Filters = keyof Omit<SubscriberFilters, "search">;

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: Filters;
  label: string;
  minWidth: string;
  options: FilterOption[];
  hasSearch?: boolean;
  manageOption?: string;
  manageOptionUrl?: string;
}

export interface DataTableProps<TData> {
  table: Table<TData>;
}
