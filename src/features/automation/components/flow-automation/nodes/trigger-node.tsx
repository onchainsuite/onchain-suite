import { BoltIcon } from "@heroicons/react/24/outline";
import { Handle, Position } from "reactflow";

import { type AutomationNodeData } from "@/features/automation/types";

interface TriggerNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const TriggerNode = ({ data, selected }: TriggerNodeProps) => (
  <div
    className={`min-w-[320px] rounded-2xl border bg-card p-5 shadow-md transition-all ${
      selected
        ? "border-sky-500/60 shadow-sky-500/10 ring-2 ring-sky-500/25"
        : "border-border hover:-translate-y-0.5 hover:border-sky-500/40 hover:shadow-lg"
    }`}
  >
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3.5 w-3.5 border-2 border-sky-400 bg-background"
    />
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10">
        <BoltIcon
          aria-hidden="true"
          className="h-5 w-5 text-sky-600 dark:text-sky-400"
        />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-sky-600 dark:text-sky-400">
          Trigger
        </p>
        <p className="font-semibold tracking-tight text-foreground">
          {data.label}
        </p>
      </div>
    </div>
    {data.contract && (
      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-700 dark:text-sky-200">
            {data.contract}
          </span>
          <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
            {data.event}
          </span>
          {data.chain && data.chain === "All Chains" && (
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-700 dark:text-emerald-200">
              {data.chain}
            </span>
          )}
        </div>
        {data.preview && (
          <div className="rounded-xl border border-sky-500/15 bg-sky-500/5 px-3 py-2.5">
            <p className="text-xs leading-5 text-muted-foreground">
              {data.preview}
            </p>
          </div>
        )}
      </div>
    )}
  </div>
);
