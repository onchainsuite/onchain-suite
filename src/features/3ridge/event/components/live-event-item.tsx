import { Badge } from "@/components/ui/badge";

interface LiveEventItemProps {
  id: string;
  type: string;
  user: string;
  method: string;
  timestamp: string;
  status: "success" | "failed";
}

export function LiveEventItem({
  type,
  user,
  method,
  timestamp,
  status,
}: LiveEventItemProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-4">
        <div
          className={`h-2 w-2 shrink-0 rounded-full ${status === "success" ? "bg-teal-500" : "bg-red-500"}`}
        />
        <Badge variant="outline" className="shrink-0 font-mono text-xs">
          {type}
        </Badge>
        <span className="min-w-0 truncate font-mono text-sm text-muted-foreground">
          {user}
        </span>
        <Badge variant="secondary" className="shrink-0 text-xs">
          {method}
        </Badge>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <Badge
          variant={status === "success" ? "default" : "destructive"}
          className="shrink-0"
        >
          {status}
        </Badge>
        <span className="shrink-0 text-sm text-muted-foreground">
          {timestamp}
        </span>
      </div>
    </div>
  );
}
