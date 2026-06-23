import { FireIcon, GitBranchIcon, SnowIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Handle, Position } from "reactflow";

import { type AutomationNodeData } from "@/features/automation/types";

interface BranchNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const BranchNode = ({ data, selected }: BranchNodeProps) => (
  <div
    className={`min-w-[256px] rounded-2xl border bg-card p-4 shadow-sm transition-all ${
      selected
        ? "border-cyan-500/60 ring-2 ring-cyan-500/25"
        : "border-border hover:border-cyan-500/40"
    }`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-3.5 w-3.5 border-2 border-cyan-400 bg-background"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="yes"
      className="h-3.5 w-3.5 border-2 border-emerald-400 bg-background"
      style={{ left: "30%" }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="no"
      className="h-3.5 w-3.5 border-2 border-orange-400 bg-background"
      style={{ left: "70%" }}
    />
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
        <HugeiconsIcon
          icon={GitBranchIcon}
          className="h-5 w-5 text-cyan-600 dark:text-cyan-400"
        />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-400">
          Branch
        </p>
        <p className="font-semibold tracking-tight text-foreground">
          {data.label}
        </p>
      </div>
    </div>
    <div className="mt-3 flex justify-between rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs">
      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-300">
        <HugeiconsIcon icon={SnowIcon} className="h-3 w-3" /> Cold
      </span>
      <span className="flex items-center gap-1 text-orange-600 dark:text-orange-300">
        <HugeiconsIcon icon={FireIcon} className="h-3 w-3" /> Warm
      </span>
    </div>
  </div>
);
