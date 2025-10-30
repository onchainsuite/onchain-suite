import { Settings } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

export function GeneralSettingsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <CardTitle>General Settings</CardTitle>
        </div>
        <CardDescription>
          Basic project configuration and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Project Name</Label>
          <Input defaultValue="3ridge Dashboard" />
        </div>

        <div className="space-y-2">
          <Label>Project ID</Label>
          <Input defaultValue="3ridge-prod-2024" disabled />
        </div>

        <div className="space-y-2">
          <Label>Project Description</Label>
          <Textarea
            defaultValue="Web3 authentication and identity management platform"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Primary Domain</Label>
          <Input defaultValue="3ridge.io" />
        </div>

        <div className="space-y-2">
          <Label>Environment</Label>
          <Select defaultValue="production">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="production">Production</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Timezone</Label>
          <Select defaultValue="utc">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="est">Eastern Time</SelectItem>
              <SelectItem value="pst">Pacific Time</SelectItem>
              <SelectItem value="cet">Central European Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full">Save General Settings</Button>
      </CardContent>
    </Card>
  );
}
