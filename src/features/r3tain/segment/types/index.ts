export interface Segment {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "subscriber" | "customer";
}

export interface SavedSegment {
  id: string;
  name: string;
  created: string;
  createdDate: Date;
}

export type SortOption = "date-added" | "name" | "size";
export type SortOrder = "asc" | "desc";

export interface FilterOperator {
  id: string;
  label: string;
  requiresValue: boolean;
  requiresSecondaryValue?: boolean;
  inputType?:
    | "text"
    | "number"
    | "date"
    | "select"
    | "multiselect"
    | "distance"
    | "location";
  placeholder?: string;
  options?: string[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface FilterConfiguration {
  filterId: string;
  operators: FilterOperator[];
}

export interface FilterOption {
  id: string;
  label: string;
  category: string;
  subcategory?: string;
}

export interface Filter {
  id: string;
  option: FilterOption | null;
  operator: "and" | "or";
  filterOperator: FilterOperator | null;
  value: string | string[];
  secondaryValue?: string;
}
