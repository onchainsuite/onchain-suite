import { Clock, MoreVertical, Webhook } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WebhookCardProps {
  id: number;
  name: string;
  url: string;
  events: string[];
  status: string;
  lastTriggered: string;
  successRate: number;
}

export function WebhookCard({
  name,
  url,
  events,
  status,
  lastTriggered,
  successRate,
}: WebhookCardProps) {
  return (
    <Card className="border-2 border-border">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Webhook className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{name}</h3>
                  <Badge
                    variant={status === "active" ? "default" : "secondary"}
                  >
                    {status}
                  </Badge>
                </div>
                <p className="truncate font-mono text-sm text-muted-foreground">
                  {url}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {events.map((event) => (
                <Badge
                  key={event}
                  variant="outline"
                  className="font-mono text-xs"
                >
                  {event}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">
                  Last triggered {lastTriggered}
                </span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span className="whitespace-nowrap text-teal-500">
                {successRate}% success rate
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Webhook</DropdownMenuItem>
              <DropdownMenuItem>Test Webhook</DropdownMenuItem>
              <DropdownMenuItem>View Logs</DropdownMenuItem>
              <DropdownMenuItem>Copy URL</DropdownMenuItem>
              <DropdownMenuItem>
                {status === "active" ? "Disable" : "Enable"}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
