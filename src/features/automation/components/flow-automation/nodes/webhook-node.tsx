import { LinkIcon } from "@heroicons/react/24/outline";
import { Handle, Position } from "reactflow";

import { type AutomationNodeData } from "@/features/automation/types";

interface WebhookNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

/** Integration action node that calls an external URL (`webhook`). */
export const WebhookNode = ({ data, selected }: WebhookNodeProps) => (
  <div
    className={`min-w-[216px] rounded-xl border bg-card p-3.5 shadow-sm transition-all ${
      selected
        ? "border-amber-500/60 shadow-amber-500/10 ring-2 ring-amber-500/25"
        : "border-border hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-lg"
    }`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-2.5 w-2.5 border-2 border-amber-400 bg-background"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-2.5 w-2.5 border-2 border-amber-400 bg-background"
    />
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
        <LinkIcon
          aria-hidden="true"
          className="h-4 w-4 text-amber-600 dark:text-amber-400"
        />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-amber-600 dark:text-amber-400">
          Webhook
        </p>
        <p className="text-sm font-semibold tracking-tight text-foreground">
          {data.label}
        </p>
      </div>
    </div>
    {data.url && (
      <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-amber-500/15 bg-amber-500/5 px-3 py-2">
        <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-700 dark:text-amber-300">
          {data.method ?? "POST"}
        </span>
        <p className="line-clamp-1 text-xs text-muted-foreground">{data.url}</p>
      </div>
    )}
  </div>
);
