"use client";

import { CheckCircle2, Lock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function ThreeRidgeStep() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-6 rounded-lg border border-primary/30 bg-primary/5">
        <div className="shrink-0 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2">
            3ridge Authentication
          </h3>
          <p className="text-sm text-muted-foreground">
            Your wallet-first auth layer. Users connect once, stay logged in
            across sessions with ZK-proofs.
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
                  Multi-Chain Support
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  EVM, Solana, Cosmos—all in one SDK
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
                  Session Tracking
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-pipes login events to analytics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Quick Tip:</span> Test
          your first auth in the &quot;3ridge Playground&quot; from the sidebar
        </p>
      </div>
    </div>
  );
}
