"use client";

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

import { type SecurityToggleProps } from "@/3ridge/routes/types";

function SecurityToggle({
  label,
  description,
  defaultChecked = false,
}: SecurityToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

export function SecurityRulesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Rules</CardTitle>
        <CardDescription>
          Configure security policies and threat protection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SecurityToggle
          label="Rate Limiting"
          description="Limit requests per IP address"
          defaultChecked
        />
        <SecurityToggle
          label="DDoS Protection"
          description="Automatic DDoS mitigation"
          defaultChecked
        />
        <SecurityToggle
          label="Bot Detection"
          description="Block automated bot traffic"
          defaultChecked
        />
        <SecurityToggle
          label="SQL Injection Protection"
          description="Detect and block SQL injection attempts"
          defaultChecked
        />

        <div className="space-y-2">
          <Label>Max Requests per Minute</Label>
          <Input type="number" defaultValue="100" />
        </div>

        <div className="space-y-2">
          <Label>Lockout Duration (minutes)</Label>
          <Input type="number" defaultValue="15" />
        </div>

        <Button className="w-full">Save Security Rules</Button>
      </CardContent>
    </Card>
  );
}
