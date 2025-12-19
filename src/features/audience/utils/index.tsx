import type { ReactElement } from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export function getStatusIcon(status: string): ReactElement {
  switch (status) {
    case "verified":
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
    case "pending":
      return <Clock className="h-3.5 w-3.5 text-amber-500" />;
    default:
      return <AlertCircle className="h-3.5 w-3.5 text-red-500" />;
  }
}

export function getHealthColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

export function getHealthBarColor(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}
