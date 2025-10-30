import { AlertTriangle, Lock, Shield } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { type StatCardProps } from "@/3ridge/routes/types";

function StatCard({
  title,
  value,
  description,
  icon,
  borderColor,
  gradientFrom,
  iconColor,
}: StatCardProps) {
  return (
    <Card
      className={`${borderColor} bg-linear-to-br ${gradientFrom} to-transparent`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={iconColor}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function StatsOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard
        title="Active Policies"
        value={12}
        description="4 inactive policies"
        icon={<Shield className="h-4 w-4" />}
        borderColor="border-primary/20"
        gradientFrom="from-primary/5"
        iconColor="text-primary"
      />
      <StatCard
        title="Blocked Requests"
        value="3,421"
        description="Last 24 hours"
        icon={<Lock className="h-4 w-4" />}
        borderColor="border-teal-500/20"
        gradientFrom="from-teal-500/5"
        iconColor="text-teal-500"
      />
      <StatCard
        title="Policy Violations"
        value={847}
        description="Flagged attempts"
        icon={<AlertTriangle className="h-4 w-4" />}
        borderColor="border-red-500/20"
        gradientFrom="from-red-500/5"
        iconColor="text-red-500"
      />
    </div>
  );
}
