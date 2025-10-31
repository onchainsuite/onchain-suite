"use client";

import { CheckCircle2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardOverviewStep() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-6 rounded-lg border border-primary/30 bg-primary/5">
        <div className="shrink-0 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Your Dashboard
          </h3>
          <p className="text-sm text-muted-foreground">
            Everything you need in one place—metrics, quick actions, and
            activity feed.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">
                1
              </Badge>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Hero Metrics
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Track 3ridge auths, D7 retention, R3tain sends, and custom
                  metrics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">
                2
              </Badge>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Suite Spotlight
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Deep dive into each product with live charts and quick actions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">
                3
              </Badge>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Activity Feed
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Real-time events from all three products in one unified stream
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                You&apos;re All Set!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click &quot;Enter Dashboard&quot; to start building your
                retention engine
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
