import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { type Segment } from "../types";

interface StatsCardProps {
  title: string;
  value: string | number;
}

export function StatsCard({ title, value }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function StatsGrid({ segments }: { segments: Segment[] }) {
  const totalUsers = segments.reduce((acc, s) => acc + s.users, 0);
  const activeSegments = segments.filter((s) => s.status === "Active").length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard title="Total Segments" value={segments.length} />
      <StatsCard title="Total Users" value={totalUsers.toLocaleString()} />
      <StatsCard title="Active Segments" value={activeSegments} />
    </div>
  );
}
