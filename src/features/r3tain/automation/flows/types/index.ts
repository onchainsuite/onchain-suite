export interface AutomationFlow {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed";
  createdDate: string;
  lastModified: string;
  isActivated: boolean;
  description?: string;
  performance?: {
    sent: number;
    opened: number;
    clicked: number;
  };
}

export type DateRangeType = "all" | "7days" | "30days" | "90days";

export interface FlowFilters {
  status: string[];
  dateRange: DateRangeType;
  search: string;
}
