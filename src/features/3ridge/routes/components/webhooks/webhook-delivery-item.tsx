import { CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface WebhookDeliveryItemProps {
  id: string;
  webhook: string;
  event: string;
  status: "success" | "failed";
  responseTime: string;
  timestamp: string;
}

export function WebhookDeliveryItem({
  webhook,
  event,
  status,
  responseTime,
  timestamp,
}: WebhookDeliveryItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-3">
        {status === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-teal-500" />
        ) : (
          <XCircle className="h-5 w-5 text-destructive" />
        )}
        <div>
          <p className="font-medium">{webhook}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {event}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {responseTime}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={status === "success" ? "default" : "destructive"}>
          {status}
        </Badge>
        <span className="text-sm text-muted-foreground">{timestamp}</span>
      </div>
    </div>
  );
}
