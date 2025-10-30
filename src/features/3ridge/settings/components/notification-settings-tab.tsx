import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const notificationOptions = [
  {
    id: "email",
    label: "Email Notifications",
    description: "Receive notifications via email",
    defaultChecked: true,
  },
  {
    id: "security",
    label: "Security Alerts",
    description: "Get notified of security events",
    defaultChecked: true,
  },
  {
    id: "failed-login",
    label: "Failed Login Alerts",
    description: "Alert on failed authentication attempts",
    defaultChecked: true,
  },
  {
    id: "webhooks",
    label: "Webhook Failures",
    description: "Notify when webhooks fail",
    defaultChecked: true,
  },
  {
    id: "weekly",
    label: "Weekly Reports",
    description: "Receive weekly analytics reports",
    defaultChecked: false,
  },
  {
    id: "updates",
    label: "Product Updates",
    description: "Get notified of new features",
    defaultChecked: true,
  },
];

export function NotificationSettingsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle>Notification Preferences</CardTitle>
        </div>
        <CardDescription>
          Configure how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationOptions.map((option) => (
          <div key={option.id} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{option.label}</Label>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
            <Switch defaultChecked={option.defaultChecked} />
          </div>
        ))}

        <Button className="w-full">Save Notification Settings</Button>
      </CardContent>
    </Card>
  );
}
