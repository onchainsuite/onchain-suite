import { AlertTriangle, FileText, Info, XCircle } from "lucide-react";

import { type StatConfig } from "@/3ridge/logs/types";

export const stats: StatConfig[] = [
  { title: "Info", value: "45.2K", icon: Info, variant: "blue" },
  { title: "Warnings", value: "1,234", icon: AlertTriangle, variant: "yellow" },
  { title: "Errors", value: "89", icon: XCircle, variant: "red" },
  { title: "Total Logs", value: "46.5K", icon: FileText, variant: "primary" },
];

export const logs = [
  {
    id: "log_1",
    level: "info" as const,
    message: "User authentication successful",
    source: "auth-service",
    user: "0x742d...3f4a",
    timestamp: "2024-01-15 14:32:18.234",
    metadata: { method: "wallet", ip: "192.168.1.1" },
  },
  {
    id: "log_2",
    level: "warning" as const,
    message: "Rate limit approaching threshold",
    source: "rate-limiter",
    user: "0x8a3c...9b2d",
    timestamp: "2024-01-15 14:31:45.123",
    metadata: { requests: 95, limit: 100 },
  },
  {
    id: "log_3",
    level: "error" as const,
    message: "Failed to verify zk-proof",
    source: "zk-verifier",
    user: "0x1f5e...7c8b",
    timestamp: "2024-01-15 14:30:12.456",
    metadata: { reason: "Invalid signature", code: "ZK_001" },
  },
  {
    id: "log_4",
    level: "info" as const,
    message: "Webhook delivered successfully",
    source: "webhook-service",
    user: "system",
    timestamp: "2024-01-15 14:28:33.789",
    metadata: { webhook: "auth-webhook", status: 200 },
  },
  {
    id: "log_5",
    level: "error" as const,
    message: "Database connection timeout",
    source: "database",
    user: "system",
    timestamp: "2024-01-15 14:25:01.012",
    metadata: { timeout: "5000ms", retries: 3 },
  },
];
