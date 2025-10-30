import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface RecentConnectionItemProps {
  wallet: string;
  provider: string;
  time: string;
  status: "success" | "failed";
}

export function RecentConnectionItem({
  wallet,
  provider,
  time,
  status,
}: RecentConnectionItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-3">
        {status === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-teal-500" />
        ) : (
          <XCircle className="h-5 w-5 text-destructive" />
        )}
        <div>
          <p className="font-mono text-sm font-medium">{wallet}</p>
          <p className="text-xs text-muted-foreground">{provider}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        {time}
      </div>
    </div>
  );
}
