"use client";

import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";

import { type Alert } from "../types";

interface AlertExplanationDialogProps {
  alert: Alert | null;
  open: boolean;
  onClose: () => void;
}

export function AlertExplanationDialog({
  alert,
  open,
  onClose,
}: AlertExplanationDialogProps) {
  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <alert.icon className="h-5 w-5" />
            AI Explanation
          </DialogTitle>
          <DialogDescription>Understanding this alert</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">{alert.name}</h3>
            <p className="text-sm text-muted-foreground">{alert.description}</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary">
            <h4 className="font-semibold mb-2 text-sm">AI Analysis</h4>
            <p className="text-sm text-muted-foreground">
              This alert was triggered because the churn rate exceeded the
              threshold of 5% within a 24-hour period. The spike appears to be
              concentrated in the &quot;New Users&quot; segment, suggesting
              potential onboarding issues. Recommended action: Review recent
              changes to the onboarding flow and consider implementing retention
              campaigns.
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1">Send to R3tain</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Mark Resolved
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
