export type SegmentStatus = "Active" | "Paused";

export interface Segment {
  id: string;
  name: string;
  users: number;
  criteria: string;
  lastSync: string;
  status: SegmentStatus;
}

// Types
export type VersionStatus = "Current" | "Previous" | "Initial";
export type DiffType = "Added" | "Removed" | "Unchanged";

export interface Version {
  id: string;
  version: string;
  date: string;
  users: number;
  change: string;
  status: VersionStatus;
}

export interface DiffData {
  type: DiffType;
  count: number;
  percentage: string;
}

export interface SegmentOption {
  value: string;
  label: string;
}

export interface VersionRowProps {
  version: Version;
}

export interface DiffItemProps {
  diff: DiffData;
}

export interface VersionedPageHeaderProps {
  selectedSegment: string;
  onSegmentChange: (value: string) => void;
  segments: SegmentOption[];
}

export interface CreateSegmentFormData {
  name: string;
  criteria: string;
  dateRange: string;
}
