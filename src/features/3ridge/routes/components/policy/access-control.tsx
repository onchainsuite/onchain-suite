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

import { type AccessControlToggleProps } from "@/3ridge/routes/types";

function AccessControlToggle({
  label,
  description,
  defaultChecked = false,
}: AccessControlToggleProps) {
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

export function AccessControlTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Control</CardTitle>
        <CardDescription>
          Manage IP allowlists, blocklists, and geo-restrictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AccessControlToggle
          label="IP Allowlist"
          description="Only allow specific IP addresses"
        />

        <div className="space-y-2">
          <Label>Allowed IP Ranges (CIDR)</Label>
          <Input placeholder="192.168.0.0/16, 10.0.0.0/8" />
        </div>

        <AccessControlToggle
          label="IP Blocklist"
          description="Block specific IP addresses"
          defaultChecked
        />

        <div className="space-y-2">
          <Label>Blocked IP Addresses</Label>
          <Input placeholder="203.0.113.0, 198.51.100.0" />
        </div>

        <AccessControlToggle
          label="Geo-Blocking"
          description="Block requests from specific countries"
        />

        <div className="space-y-2">
          <Label>Blocked Countries (ISO codes)</Label>
          <Input placeholder="CN, RU, KP" />
        </div>

        <Button className="w-full">Save Access Control</Button>
      </CardContent>
    </Card>
  );
}
