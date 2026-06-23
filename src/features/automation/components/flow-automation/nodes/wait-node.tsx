import { Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Handle, Position } from "reactflow";

import { type AutomationNodeData } from "@/features/automation/types";

interface WaitNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const WaitNode = ({ data, selected }: WaitNodeProps) => (
  <div
    className={`min-w-[220px] rounded-2xl border bg-card p-4 shadow-sm transition-all ${
      selected
        ? "border-violet-500/60 ring-2 ring-violet-500/25"
        : "border-border hover:border-violet-500/40"
    }`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-3.5 w-3.5 border-2 border-violet-400 bg-background"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3.5 w-3.5 border-2 border-violet-400 bg-background"
    />
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
        <HugeiconsIcon
          icon={Clock01Icon}
          className="h-5 w-5 text-violet-600 dark:text-violet-400"
        />
      </div>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-violet-600 dark:text-violet-400">
          Wait
        </p>
        <p className="font-semibold tracking-tight text-foreground">
          {data.duration ?? "3 days"}
        </p>
      </div>
    </div>
  </div>
);
