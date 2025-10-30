"use client";

import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BiometricMethodCardProps {
  name: string;
  icon: LucideIcon;
  enabled: boolean;
  users: number;
  color: string;
}

export function BiometricMethodCard({
  name,
  icon: Icon,
  enabled,
  users,
  color,
}: BiometricMethodCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>{users.toLocaleString()} users</CardDescription>
            </div>
          </div>
          <Badge variant={enabled ? "default" : "secondary"}>
            {enabled ? "enabled" : "disabled"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Enable Method</Label>
          <Switch defaultChecked={enabled} />
        </div>

        <div className="flex items-center justify-between">
          <Label>Require Fallback</Label>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label>zk-Sync Verification</Label>
          <Switch defaultChecked={enabled} />
        </div>

        <div className="space-y-2">
          <Label>Max Attempts</Label>
          <Input type="number" defaultValue="3" />
        </div>

        <div className="space-y-2">
          <Label>Timeout (seconds)</Label>
          <Input type="number" defaultValue="30" />
        </div>

        <Button className="w-full" variant={enabled ? "outline" : "default"}>
          {enabled ? "Update Settings" : "Enable Method"}
        </Button>
      </CardContent>
    </Card>
  );
}
