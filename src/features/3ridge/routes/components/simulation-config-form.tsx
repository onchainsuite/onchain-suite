"use client";

import { Play } from "lucide-react";

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

interface SimulationConfigFormProps {
  onRun: () => void;
}

export function SimulationConfigForm({ onRun }: SimulationConfigFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Simulation</CardTitle>
        <CardDescription>Set up event parameters for testing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Event Type</Label>
          <Select defaultValue="auth.login">
            <SelectTrigger>
              <SelectValue />
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
          <Label>User ID</Label>
          <Input placeholder="0x742d...3f4a" />
        </div>

        <div className="space-y-2">
          <Label>Authentication Method</Label>
          <Select defaultValue="wallet">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wallet">Wallet</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="oauth">OAuth</SelectItem>
              <SelectItem value="biometric">Biometric</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Custom Payload (JSON)</Label>
          <Textarea
            placeholder='{\n  "metadata": {\n    "ip": "192.168.1.1",\n    "device": "Chrome"\n  }\n}'
            className="font-mono text-sm"
            rows={6}
          />
        </div>

        <Button className="w-full gap-2" onClick={onRun}>
          <Play className="h-4 w-4" />
          Run Simulation
        </Button>
      </CardContent>
    </Card>
  );
}
