import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { eventTypes } from "@/3ridge/event/data";

export function EventTypeDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Type Distribution</CardTitle>
        <CardDescription>Real-time breakdown of event types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {eventTypes.map((item) => (
            <div key={item.type} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono">{item.type}</span>
                <span className="text-muted-foreground">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
