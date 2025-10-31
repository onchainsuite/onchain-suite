"use client";

import { BarChart3, CheckCircle2, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { SetupStepProps } from "@/common/dashboard/types";

export function Onch3nSetupStep({ formData, setFormData }: SetupStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4" />
          Analytics Consent
        </Label>
        <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/50">
          <input
            type="checkbox"
            id="analyticsConsent"
            checked={formData.analyticsConsent}
            onChange={(e) =>
              setFormData({ ...formData, analyticsConsent: e.target.checked })
            }
            className="mt-1"
          />
          <div>
            <label
              htmlFor="analyticsConsent"
              className="text-sm font-medium cursor-pointer"
            >
              ZK-aggregate my data for insights (Revocable anytime)
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              We store proofs only—no raw IPs. GDPR/CCPA compliant.
            </p>
          </div>
        </div>
      </div>

      <div>
        <Label
          htmlFor="webhookEndpoint"
          className="flex items-center gap-2 mb-2"
        >
          <BarChart3 className="h-4 w-4" />
          Webhook Endpoint
          <Badge variant="secondary" className="text-xs">
            Auto-Generated
          </Badge>
        </Label>
        <Input
          id="webhookEndpoint"
          placeholder="https://api.yourproject.com/webhook"
          value={
            formData.webhookEndpoint ??
            `https://webhook.onchain.suite/${formData.projectName.toLowerCase().replace(/\s+/g, "-")}`
          }
          onChange={(e) =>
            setFormData({ ...formData, webhookEndpoint: e.target.value })
          }
        />
        <p className="text-xs text-muted-foreground mt-1">
          Pipes 3ridge logins → Onch3n behaviors for session tracking
        </p>
      </div>

      <div>
        <Label htmlFor="retentionGoal" className="flex items-center gap-2 mb-2">
          Retention Goal (D7)
          <Badge variant="secondary" className="text-xs">
            Optional
          </Badge>
        </Label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            id="retentionGoal"
            min="50"
            max="90"
            value={formData.retentionGoal}
            onChange={(e) =>
              setFormData({
                ...formData,
                retentionGoal: Number.parseInt(e.target.value, 10),
              })
            }
            className="flex-1"
          />
          <span className="text-2xl font-bold text-primary w-16 text-right">
            {formData.retentionGoal}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Based on {formData.projectType} average: 65%—adjust yours
        </p>
      </div>

      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Sync Test Ready
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                We&apos;ll fire a sample webhook from 3ridge to Onch3n—your
                first cohort ready in 24h
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
