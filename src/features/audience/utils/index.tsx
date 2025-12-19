import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { ReactElement } from "react";

export function getStatusIcon(status: string): ReactElement {
  switch (status) {
    case "verified":
      return <CheckCircle2 className="h-3.5 w-3.5 text-primary" />;
    case "pending":
      return <Clock className="h-3.5 w-3.5 text-secondary" />;
    default:
      return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
  }
}

export function getHealthColor(score: number): string {
  if (score >= 70) return "text-primary";
  if (score >= 40) return "text-secondary";
  return "text-destructive";
}

export function getHealthBarColor(score: number): string {
  if (score >= 70) return "bg-primary";
  if (score >= 40) return "bg-secondary";
  return "bg-destructive";
}
