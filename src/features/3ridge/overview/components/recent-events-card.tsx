import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const recentEvents = [
  {
    event: "wallet_connect",
    route: "/auth/wallets",
    status: "success",
    time: "2m ago",
  },
  {
    event: "email_verify",
    route: "/auth/email",
    status: "success",
    time: "5m ago",
  },
  {
    event: "webhook_sent",
    route: "/routes/webhooks",
    status: "success",
    time: "8m ago",
  },
  {
    event: "proof_verify",
    route: "/playground",
    status: "pending",
    time: "12m ago",
  },
  {
    event: "oauth_callback",
    route: "/auth/oauth",
    status: "success",
    time: "15m ago",
  },
];

export function RecentEventsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
        <CardDescription>
          Latest authentication and routing events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentEvents.map((item) => (
            <div
              key={v7()}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${
                    item.status === "success" ? "bg-primary" : "bg-secondary"
                  } animate-pulse`}
                />
                <div>
                  <p className="text-sm font-medium">{item.event}</p>
                  <p className="text-xs text-muted-foreground">{item.route}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={item.status === "success" ? "default" : "secondary"}
                >
                  {item.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
