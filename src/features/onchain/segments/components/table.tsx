import { RefreshCw, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { type Segment, type SegmentStatus } from "@/onchain/segments/types";

interface SegmentRowProps {
  segment: Segment;
  onSync: (id: string) => void;
  onOptimize: (id: string) => void;
}

export function SegmentRow({ segment, onSync, onOptimize }: SegmentRowProps) {
  const getStatusVariant = (status: SegmentStatus): "default" | "secondary" => {
    return status === "Active" ? "default" : "secondary";
  };

  return (
    <tr className="border-b">
      <td className="p-4 font-semibold">{segment.name}</td>
      <td className="p-4">{segment.users.toLocaleString()}</td>
      <td className="p-4 font-mono text-sm text-muted-foreground">
        {segment.criteria}
      </td>
      <td className="p-4 text-muted-foreground">{segment.lastSync}</td>
      <td className="p-4">
        <Badge variant={getStatusVariant(segment.status)}>
          {segment.status}
        </Badge>
      </td>
      <td className="p-4">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => onSync(segment.id)}
          >
            <RefreshCw className="w-3 h-3" />
            Sync
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => onOptimize(segment.id)}
          >
            <Sparkles className="w-3 h-3" />
            Optimize
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function SegmentsTable({
  segments,
  onSync,
  onOptimize,
}: {
  segments: Segment[];
  onSync: (id: string) => void;
  onOptimize: (id: string) => void;
}) {
  return (
    <div className="border rounded-md">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-4 text-sm font-medium text-left">Name</th>
            <th className="p-4 text-sm font-medium text-left">Users</th>
            <th className="p-4 text-sm font-medium text-left">Criteria</th>
            <th className="p-4 text-sm font-medium text-left">Last Sync</th>
            <th className="p-4 text-sm font-medium text-left">Status</th>
            <th className="p-4 text-sm font-medium text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((segment) => (
            <SegmentRow
              key={segment.id}
              segment={segment}
              onSync={onSync}
              onOptimize={onOptimize}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
