"use client";

interface FunnelRevenueDisplayProps {
  revenuePerRecipient: string;
}

export function FunnelRevenueDisplay({
  revenuePerRecipient,
}: FunnelRevenueDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <span className="text-primary border-primary border-b-2 border-dotted text-sm font-medium">
          Attributed revenue per recipient
        </span>
      </div>
      <div className="space-y-1">
        <div className="text-foreground text-3xl font-bold">
          ${revenuePerRecipient}
        </div>
        <div className="text-muted-foreground text-sm">--</div>
      </div>
    </div>
  );
}
