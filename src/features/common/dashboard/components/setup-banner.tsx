"use client";

import { Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SetupBannerProps {
  onComplete: () => void;
}

export function SetupBanner({ onComplete }: SetupBannerProps) {
  return (
    <Card className="border-amber-500/50 bg-amber-500/5 backdrop-blur-sm shadow-lg shadow-amber-500/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Wrench className="h-6 w-6 text-amber-400" />
            <div>
              <p className="font-semibold text-foreground">
                Complete Your Setup
              </p>
              <p className="text-sm text-muted-foreground">
                Finish configuring your project to unlock full analytics and
                features
              </p>
            </div>
          </div>
          <Button onClick={onComplete} size="sm">
            Complete Setup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
