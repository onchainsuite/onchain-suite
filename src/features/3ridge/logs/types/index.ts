import { type LucideIcon } from "lucide-react";

export type LogLevel = "info" | "warning" | "error" | "debug";

export type LogSource = "all" | "auth" | "webhook" | "database" | "zk";

export type StatVariant = "blue" | "yellow" | "red" | "primary";

export interface Log {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: string;
  source?: string;
  user?: string;
  metadata?: Record<string, unknown>;
}

export interface StatConfig {
  title: string;
  value: string;
  icon: LucideIcon;
  variant: StatVariant;
}

export interface LogFiltersProps {
  selectedSource?: LogSource;
  onSourceChange?: (source: LogSource) => void;
  onFilterClick?: () => void;
}

export interface LogSearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export interface LogPaginationProps {
  total?: number;
  current?: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

export interface LogListProps {
  logs: Log[];
  filterLevel?: LogLevel | null;
}

export interface LogTabContentProps {
  title: string;
  description: string;
  filterLevel?: LogLevel | null;
  logs: Log[];
}

export interface LogConfigurationProps {
  defaultLogLevel?: LogLevel;
  defaultRetentionDays?: number;
  onSave?: (config: { logLevel: LogLevel; retentionDays: number }) => void;
}
