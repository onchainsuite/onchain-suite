"use client";

import { Mail, Send, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { SetupStepProps } from "@/common/dashboard/types";

export function R3tainSetupStep({ formData, setFormData }: SetupStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email" className="flex items-center gap-2 mb-2">
          <Mail className="h-4 w-4" />
          Your Email Address
          <Badge variant="destructive" className="text-xs">
            Required
          </Badge>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@yourproject.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          For campaign reports and notifications (ZK-hashed for storage)
        </p>
      </div>

      <div>
        <Label htmlFor="senderDomain" className="flex items-center gap-2 mb-2">
          <Send className="h-4 w-4" />
          Sender Domain
          <Badge variant="secondary" className="text-xs">
            Optional
          </Badge>
        </Label>
        <Input
          id="senderDomain"
          placeholder="news@yourproject.com"
          value={formData.senderDomain ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, senderDomain: e.target.value })
          }
        />
        <p className="text-xs text-muted-foreground mt-1">
          Skip to use OnchainSuite relay—upgrade later with custom domain
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Welcome Sequence Ready!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                We&apos;ll auto-launch a pre-filled welcome campaign with your
                project name
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
