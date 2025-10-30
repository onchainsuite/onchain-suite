import { AlertCircle, TrendingUp, Users } from "lucide-react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const alerts = [
  {
    type: "Critical",
    message: "Churn rate spike in Pro tier",
    icon: AlertCircle,
    color: "text-red-500",
  },
  {
    type: "Info",
    message: "New user growth accelerating",
    icon: TrendingUp,
    color: "text-blue-500",
  },
  {
    type: "Warning",
    message: "Segment sync pending",
    icon: Users,
    color: "text-yellow-500",
  },
];

export function AlertHighlights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Highlights</CardTitle>
        <CardDescription>Recent notifications and warnings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={v7()}
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
          >
            <alert.icon className={`h-5 w-5 mt-0.5 ${alert.color}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {alert.type}
                </Badge>
              </div>
              <p className="text-sm">{alert.message}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
