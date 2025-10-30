import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { endpoints } from "../data";

interface StatsCardProps {
  title: string;
  value: string | number;
  showProgress?: boolean;
  progressValue?: number;
}

export function StatsCard({
  title,
  value,
  showProgress,
  progressValue,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showProgress && progressValue !== undefined ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${progressValue}%` }}
              />
            </div>
            <span className="text-sm font-medium">{progressValue}%</span>
          </div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatsCard title="Total Endpoints" value={endpoints.length} />
      <StatsCard title="Requests Today" value="12,456" />
      <StatsCard title="Rate Limit" value="" showProgress progressValue={45} />
    </div>
  );
}
