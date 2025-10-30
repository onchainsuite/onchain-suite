"use client";

import { Play } from "lucide-react";
import { v7 } from "uuid";

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

import { SimulationConfigForm } from "../simulation-config-form";
import { SimulationResultDisplay } from "../simulation-result-display";
import { type SimulationResult } from "@/3ridge/routes/types";

export function EventSimulationTab({
  onRun,
  result,
}: {
  onRun: () => void;
  result: SimulationResult | null;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SimulationConfigForm onRun={onRun} />
      <SimulationResultDisplay result={result} />
    </div>
  );
}

function WebhookSelector() {
  return (
    <div className="space-y-2">
      <Label>Select Webhook</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose a webhook to test" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="webhook1">User Authentication Webhook</SelectItem>
          <SelectItem value="webhook2">Profile Updates</SelectItem>
          <SelectItem value="webhook3">Failed Login Alerts</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function EventTypeSelector() {
  return (
    <div className="space-y-2">
      <Label>Test Event Type</Label>
      <Select defaultValue="auth.login">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auth.login">auth.login</SelectItem>
          <SelectItem value="auth.logout">auth.logout</SelectItem>
          <SelectItem value="profile.updated">profile.updated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function PayloadEditor() {
  return (
    <div className="space-y-2">
      <Label>Test Payload</Label>
      <Textarea
        placeholder='{\n  "event": "auth.login",\n  "user": "0x742d...3f4a",\n  "timestamp": "2024-01-15T14:32:18Z"\n}'
        className="font-mono text-sm"
        rows={8}
      />
    </div>
  );
}

export function WebhookTestingTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Webhook Delivery</CardTitle>
        <CardDescription>
          Send test events to your webhook endpoints
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <WebhookSelector />
        <EventTypeSelector />
        <PayloadEditor />
        <Button className="w-full gap-2">
          <Play className="h-4 w-4" />
          Send Test Event
        </Button>
      </CardContent>
    </Card>
  );
}

function AuthFlowSelector() {
  return (
    <div className="space-y-2">
      <Label>Authentication Flow</Label>
      <Select defaultValue="wallet-login">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="wallet-login">Wallet Login Flow</SelectItem>
          <SelectItem value="email-signup">Email Signup Flow</SelectItem>
          <SelectItem value="oauth-google">OAuth (Google) Flow</SelectItem>
          <SelectItem value="biometric-auth">Biometric Auth Flow</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function TestUserInput() {
  return (
    <div className="space-y-2">
      <Label>Test User</Label>
      <Input placeholder="test-user@example.com" />
    </div>
  );
}

function EnvironmentSelector() {
  return (
    <div className="space-y-2">
      <Label>Environment</Label>
      <Select defaultValue="sandbox">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sandbox">Sandbox</SelectItem>
          <SelectItem value="staging">Staging</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function FlowStepsDisplay() {
  const steps = [
    "User initiates wallet connection",
    "Wallet signature request",
    "Verify signature with zk-proof",
    "Create/update user profile",
    "Generate session token",
    "Trigger webhooks",
  ];

  return (
    <div className="rounded-lg border border-border bg-accent/50 p-4">
      <h4 className="mb-2 font-medium">Flow Steps</h4>
      <ol className="space-y-2 text-sm text-muted-foreground">
        {steps.map((step, index) => (
          <li key={v7()}>
            {index + 1}. {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AuthFlowTestingTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Authentication Flow</CardTitle>
        <CardDescription>
          Simulate complete authentication workflows
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AuthFlowSelector />
        <TestUserInput />
        <EnvironmentSelector />
        <FlowStepsDisplay />
        <Button className="w-full gap-2">
          <Play className="h-4 w-4" />
          Run Flow Test
        </Button>
      </CardContent>
    </Card>
  );
}
