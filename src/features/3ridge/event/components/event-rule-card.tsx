"use client";

import { MoreVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

interface EventRuleCardProps {
  name: string;
  description: string;
  trigger: string;
  condition: string;
  action: string;
  status: "active" | "inactive";
  triggered: number;
}

export function EventRuleCard({
  name,
  description,
  trigger,
  condition,
  action,
  status,
  triggered,
}: EventRuleCardProps) {
  return (
    <Card className="border-2 border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{name}</h3>
                  <Badge
                    variant={status === "active" ? "default" : "secondary"}
                  >
                    {status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Trigger Event
                </Label>
                <Badge variant="outline" className="font-mono text-xs">
                  {trigger}
                </Badge>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Condition
                </Label>
                <p className="text-sm">{condition}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Action</Label>
                <p className="text-sm">{action}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Triggered {triggered} times</span>
              <span>•</span>
              <span>Last triggered 2 hours ago</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Rule</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>View Logs</DropdownMenuItem>
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
