import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function AppearanceSettingsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <CardTitle>Appearance</CardTitle>
        </div>
        <CardDescription>
          Customize the look and feel of your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select defaultValue="dark">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Accent Color</Label>
          <Select defaultValue="teal">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teal">Teal</SelectItem>
              <SelectItem value="violet">Violet</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Compact Mode</Label>
            <p className="text-sm text-muted-foreground">
              Reduce spacing for more content
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Animations</Label>
            <p className="text-sm text-muted-foreground">
              Enable smooth transitions
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <Button className="w-full">Save Appearance Settings</Button>
      </CardContent>
    </Card>
  );
}
