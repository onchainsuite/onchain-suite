import {
  type DiffData,
  type Segment,
  type SegmentOption,
  type Version,
} from "../types";

// Mock data
export const initialSegments: Segment[] = [
  {
    id: "1",
    name: "High-Value Traders",
    users: 12456,
    criteria: "Volume > $10k",
    lastSync: "2 hours ago",
    status: "Active",
  },
  {
    id: "2",
    name: "New Users",
    users: 45678,
    criteria: "Created < 7 days",
    lastSync: "1 hour ago",
    status: "Active",
  },
  {
    id: "3",
    name: "Dormant Wallets",
    users: 8901,
    criteria: "No activity > 30 days",
    lastSync: "5 hours ago",
    status: "Paused",
  },
  {
    id: "4",
    name: "DeFi Power Users",
    users: 3456,
    criteria: "DeFi txns > 50",
    lastSync: "30 min ago",
    status: "Active",
  },
];

// Mock data
export const versions: Version[] = [
  {
    id: "1",
    version: "v1.3",
    date: "2024-01-15",
    users: 12456,
    change: "+234",
    status: "Current",
  },
  {
    id: "2",
    version: "v1.2",
    date: "2024-01-08",
    users: 12222,
    change: "-89",
    status: "Previous",
  },
  {
    id: "3",
    version: "v1.1",
    date: "2024-01-01",
    users: 12311,
    change: "+456",
    status: "Previous",
  },
  {
    id: "4",
    version: "v1.0",
    date: "2023-12-25",
    users: 11855,
    change: "—",
    status: "Initial",
  },
];

export const diffData: DiffData[] = [
  { type: "Added", count: 345, percentage: "2.8%" },
  { type: "Removed", count: 111, percentage: "0.9%" },
  { type: "Unchanged", count: 12222, percentage: "96.3%" },
];

export const segmentOptions: SegmentOption[] = [
  { value: "high-value", label: "High-Value Traders" },
  { value: "new-users", label: "New Users" },
  { value: "dormant", label: "Dormant Wallets" },
  { value: "defi", label: "DeFi Power Users" },
];
