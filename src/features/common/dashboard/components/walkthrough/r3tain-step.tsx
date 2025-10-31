"use client";

import { Mail, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function R3tainStep() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-6 rounded-lg border border-primary/30 bg-primary/5">
        <div className="shrink-0 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2">
            R3tain Email Campaigns
          </h3>
          <p className="text-sm text-muted-foreground">
            Automated drip campaigns that re-engage dormant users. Set triggers,
            watch retention climb.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Smart Triggers
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Send when users haven&apos;t logged in for 3, 7, or 14 days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Pre-Built Templates
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  DeFi, Gaming, DAO templates ready to customize
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            Your First Campaign:
          </span>{" "}
          We&apos;ve pre-loaded a welcome sequence—check &quot;R3tain
          Campaigns&quot; to customize it
        </p>
      </div>
    </div>
  );
}
