import { Plus } from "lucide-react";

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

export function CreateRuleForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Rule</CardTitle>
        <CardDescription>
          Set up automated actions for specific events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Rule Name</Label>
            <Input placeholder="e.g., Failed Login Alert" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input placeholder="Brief description of the rule" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Trigger Event</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auth.login">auth.login</SelectItem>
              <SelectItem value="auth.logout">auth.logout</SelectItem>
              <SelectItem value="auth.failed">auth.failed</SelectItem>
              <SelectItem value="wallet.connected">wallet.connected</SelectItem>
              <SelectItem value="profile.updated">profile.updated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Condition</Label>
          <div className="grid gap-2 md:grid-cols-3">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="count">Count</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="ip">IP Address</SelectItem>
                <SelectItem value="device">Device</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="greater">Greater than</SelectItem>
                <SelectItem value="less">Less than</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="Value" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Action</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="notify">Send Notification</SelectItem>
              <SelectItem value="email">Send Email</SelectItem>
              <SelectItem value="webhook">Call Webhook</SelectItem>
              <SelectItem value="block">Block Request</SelectItem>
              <SelectItem value="log">Log Event</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Rule</Label>
            <p className="text-sm text-muted-foreground">
              Activate this rule immediately
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Create Rule
        </Button>
      </CardContent>
    </Card>
  );
}
