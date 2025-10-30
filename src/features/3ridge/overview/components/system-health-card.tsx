import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/ui/progress-bar";

const healthMetrics = [
  { label: "Uptime", value: "99.98%", progress: 99.98 },
  { label: "Event Throughput", value: "1,247/min", progress: 80 },
  { label: "Avg Latency", value: "42ms", progress: 25 },
];

const integrations = [
  { name: "R3tain", status: "Connected" },
  { name: "Onch3n", status: "Connected" },
];

export function SystemHealthCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Platform performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthMetrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{metric.label}</span>
              <span className="text-sm text-primary">{metric.value}</span>
            </div>
            <ProgressBar
              value={metric.progress}
              animated={metric.label === "Event Throughput"}
            />
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-3">Integrations Status</h4>
          <div className="space-y-2">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between p-2 rounded bg-muted/50"
              >
                <span className="text-sm">{integration.name}</span>
                <Badge className="bg-primary/20 text-primary">
                  {integration.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
