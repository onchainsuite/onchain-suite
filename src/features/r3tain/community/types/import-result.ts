export interface ImportResult {
  id: string;
  status: "success" | "partial" | "error";
  timestamp: string;
  method: string;
  totalAttempted: number;
  successfullyAdded: number;
  updated: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  communityName: string;
  tags: string[];
}

export interface ImportError {
  id: string;
  type: "validation" | "duplicate" | "system" | "permission";
  message: string;
  details?: string;
  affectedRows?: number[];
}

export interface ImportWarning {
  id: string;
  type: "data_quality" | "formatting" | "missing_fields";
  message: string;
  count: number;
}
