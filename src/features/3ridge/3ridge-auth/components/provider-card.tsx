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

interface ProviderCardProps {
  name: string;
  icon: LucideIcon;
  status: "active" | "inactive";
  users: number;
  color: string;
  onUpdate?: () => void;
  onToggle?: () => void;
}

export function ProviderCard({
  name,
  icon: Icon,
  status,
  users,
  color,
  onUpdate,
  onToggle,
}: ProviderCardProps) {
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
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Client ID</Label>
          <Input
            type="password"
            placeholder={
              status === "active" ? "••••••••••••••••" : "Enter client ID"
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Client Secret</Label>
          <Input
            type="password"
            placeholder={
              status === "active" ? "••••••••••••••••" : "Enter client secret"
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Redirect URI</Label>
          <Input
            defaultValue={`https://3ridge.io/auth/${name.toLowerCase()}/callback`}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Enable zk-Sync</Label>
          <Switch defaultChecked={status === "active"} />
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            variant={status === "active" ? "outline" : "default"}
            onClick={onUpdate}
          >
            {status === "active" ? "Update" : "Enable"}
          </Button>
          {status === "active" && (
            <Button variant="destructive" className="flex-1" onClick={onToggle}>
              Disable
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
