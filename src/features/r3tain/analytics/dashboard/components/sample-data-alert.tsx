"use client";

import { Info } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

export function SampleDataAlert() {
  return (
    <Alert className="border-warning/30 bg-warning/10 dark:bg-warning/20">
      <Info className="text-warning h-4 w-4" />
      <AlertDescription className="text-warning-foreground dark:text-warning">
        <strong>{"You're using sample data"}</strong>
        <br />
        <span className="text-sm opacity-90">
          {
            "Use R3tain's sample data to explore the Marketing dashboard. In order to see your account activity, upgrade to a Standard plan."
          }
        </span>
      </AlertDescription>
    </Alert>
  );
}
