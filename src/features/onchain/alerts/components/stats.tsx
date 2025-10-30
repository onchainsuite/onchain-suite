import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { type Alert } from "../types";

interface AlertStatsCardProps {
  title: string;
  value: number;
  variant?: "default" | "red" | "green" | "yellow";
}

export function AlertStatsCard({
  title,
  value,
  variant = "default",
}: AlertStatsCardProps) {
  const colorClass = {
    default: "",
    red: "text-red-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
  }[variant];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

export function AlertStatsSummary({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <AlertStatsCard title="Total Alerts" value={alerts.length} />
      <AlertStatsCard
        title="Active"
        value={alerts.filter((a) => a.status === "Active").length}
        variant="red"
      />
      <AlertStatsCard
        title="Resolved"
        value={alerts.filter((a) => a.status === "Resolved").length}
        variant="green"
      />
      <AlertStatsCard
        title="Snoozed"
        value={alerts.filter((a) => a.status === "Snoozed").length}
        variant="yellow"
      />
    </div>
  );
}
