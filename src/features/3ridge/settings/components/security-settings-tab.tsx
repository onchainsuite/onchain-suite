import { Shield } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

export function SecuritySettingsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Security Settings</CardTitle>
        </div>
        <CardDescription>Manage security and access control</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Session Timeout</Label>
            <p className="text-sm text-muted-foreground">
              Auto-logout after inactivity
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="space-y-2">
          <Label>Session Duration (hours)</Label>
          <Input type="number" defaultValue="24" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>IP Allowlist</Label>
            <p className="text-sm text-muted-foreground">
              Restrict access to specific IPs
            </p>
          </div>
          <Switch />
        </div>

        <div className="space-y-2">
          <Label>Allowed IP Addresses</Label>
          <Textarea
            placeholder="192.168.1.0/24&#10;10.0.0.0/8"
            rows={3}
          />
        </div>

        <Button className="w-full">Save Security Settings</Button>
      </CardContent>
    </Card>
  );
}
