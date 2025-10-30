"use client";

import { Activity, AlertTriangle, Lock, Shield } from "lucide-react";
import { v7 } from "uuid";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { StatCard } from "@/components/ui/stat-card";
import { Switch } from "@/components/ui/switch";

import {
  CircuitVersionCard,
  SecurityAlertItem,
} from "@/3ridge/security/components";
import { circuitVersions, securityAlerts } from "@/3ridge/security/data";

export function SecurityPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground">
          Configure security settings and monitor threats
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Security Score"
          value="98/100"
          description="Excellent protection"
          icon={Shield}
          variant="primary"
        />
        <StatCard
          title="Blocked Attempts"
          value="247"
          description="Last 24 hours"
          icon={Lock}
          variant="default"
        />
        <StatCard
          title="Active Policies"
          value="12"
          description="All enabled"
          icon={Activity}
          variant="default"
        />
        <StatCard
          title="Alerts"
          value="3"
          description="Require attention"
          icon={AlertTriangle}
          variant="red"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure protection mechanisms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="captcha">CAPTCHA Protection</Label>
                <p className="text-sm text-muted-foreground">
                  Enable bot detection
                </p>
              </div>
              <Switch id="captcha" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="zkproof">ZK-Proof Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require zero-knowledge proofs
                </p>
              </div>
              <Switch id="zkproof" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="2fa">Two-Factor Auth</Label>
                <p className="text-sm text-muted-foreground">
                  Additional security layer
                </p>
              </div>
              <Switch id="2fa" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Rate Limiting</Label>
                <span className="text-sm text-muted-foreground">
                  100 req/min
                </span>
              </div>
              <Slider defaultValue={[100]} max={200} step={10} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Session Timeout</Label>
                <span className="text-sm text-muted-foreground">
                  30 minutes
                </span>
              </div>
              <Slider defaultValue={[30]} max={120} step={5} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Security Alerts</CardTitle>
            <CardDescription>Monitor suspicious activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityAlerts.map((alert) => (
                <SecurityAlertItem key={v7()} {...alert} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Circuit Versions</CardTitle>
          <CardDescription>ZK-proof circuit status and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {circuitVersions.map((circuit) => (
              <CircuitVersionCard key={v7()} {...circuit} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
