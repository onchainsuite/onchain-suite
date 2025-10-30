"use client";

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

export function CreatePolicyTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Policy</CardTitle>
        <CardDescription>Set up a custom route policy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Policy Name</Label>
          <Input placeholder="e.g., Rate Limiting" />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input placeholder="Brief description of the policy" />
        </div>

        <div className="space-y-2">
          <Label>Policy Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select policy type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="access">Access Control</SelectItem>
              <SelectItem value="rate-limit">Rate Limiting</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Apply To</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select routes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Routes</SelectItem>
              <SelectItem value="auth">Authentication Routes</SelectItem>
              <SelectItem value="api">API Routes</SelectItem>
              <SelectItem value="webhooks">Webhooks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select defaultValue="medium">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Policy</Label>
            <p className="text-sm text-muted-foreground">
              Activate this policy immediately
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Create Policy
        </Button>
      </CardContent>
    </Card>
  );
}
