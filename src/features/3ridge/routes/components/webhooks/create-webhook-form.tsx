import { Copy, Plus } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const availableEvents = [
  "auth.login",
  "auth.logout",
  "auth.failed",
  "wallet.connected",
  "profile.updated",
  "profile.created",
];

export function CreateWebhookForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Webhook</CardTitle>
        <CardDescription>Set up a new webhook endpoint</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Webhook Name</Label>
          <Input placeholder="e.g., User Authentication Webhook" />
        </div>

        <div className="space-y-2">
          <Label>Endpoint URL</Label>
          <Input placeholder="https://api.example.com/webhooks/auth" />
        </div>

        <div className="space-y-2">
          <Label>Events to Subscribe</Label>
          <div className="grid gap-3 md:grid-cols-2">
            {availableEvents.map((event) => (
              <div key={event} className="flex items-center space-x-2">
                <input type="checkbox" id={event} className="h-4 w-4" />
                <label htmlFor={event} className="font-mono text-sm">
                  {event}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Authentication Method</Label>
          <Select defaultValue="bearer">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="bearer">Bearer Token</SelectItem>
              <SelectItem value="basic">Basic Auth</SelectItem>
              <SelectItem value="custom">Custom Header</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Secret Key</Label>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter secret key or generate one"
            />
            <Button variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Webhook</Label>
            <p className="text-sm text-muted-foreground">
              Activate this webhook immediately
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Create Webhook
        </Button>
      </CardContent>
    </Card>
  );
}
