export const securityAlerts = [
  {
    type: "warning",
    message: "Multiple failed login attempts",
    time: "5 min ago",
    severity: "high" as const,
  },
  {
    type: "info",
    message: "Circuit version updated",
    time: "1 hour ago",
    severity: "low" as const,
  },
  {
    type: "warning",
    message: "Unusual traffic pattern detected",
    time: "2 hours ago",
    severity: "medium" as const,
  },
  {
    type: "success",
    message: "Bot attack successfully blocked",
    time: "3 hours ago",
    severity: "low" as const,
  },
];

export const circuitVersions = [
  {
    name: "Auth Circuit v2.1",
    status: "active" as const,
    updated: "2 days ago",
  },
  {
    name: "Proof Circuit v1.8",
    status: "active" as const,
    updated: "1 week ago",
  },
  {
    name: "Verify Circuit v3.0",
    status: "pending" as const,
    updated: "Available now",
  },
];
