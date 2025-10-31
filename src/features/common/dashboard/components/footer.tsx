"use client";

import { Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DashboardFooter() {
  return (
    <footer className="sticky bottom-0 py-4 bg-background/50 backdrop-blur-sm text-center text-sm text-muted-foreground border-t ">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <span>Need Help?</span>
        <Button variant="link" className="h-auto p-0 text-primary">
          Docs
        </Button>
        <span>|</span>
        <Button variant="link" className="h-auto p-0 text-primary">
          Support
        </Button>
        <Badge
          variant="outline"
          className="ml-4 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50 dark:border-green-500/30"
        >
          <Shield className="mr-1 h-3 w-3" />
          ZK-Secured – Revoke Anytime via Ceramic
        </Badge>
      </div>
    </footer>
  );
}
