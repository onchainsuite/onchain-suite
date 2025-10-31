"use client";

import { BarChart3, CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function Onch3nStep() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-6 rounded-lg border border-primary/30 bg-primary/5">
        <div className="shrink-0 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Onch3n Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Cohort analysis, retention curves, and behavior funnels—all
            privacy-first with ZK aggregation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Real-Time Cohorts
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Track D1, D7, D30 retention automatically
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Webhook Integration
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Syncs with 3ridge logins for session tracking
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">First Cohort:</span>{" "}
          Your first analytics cohort will be ready in 24 hours after your first
          auth event
        </p>
      </div>
    </div>
  );
}
