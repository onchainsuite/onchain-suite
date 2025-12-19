import React from "react";
import { Handle, Position } from "reactflow";
import { GitBranch, Snowflake, Flame } from "lucide-react";
import { AutomationNodeData } from "@/features/automation/types";

interface BranchNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const BranchNode = ({ data, selected }: BranchNodeProps) => (
  <div
    className={`min-w-[240px] rounded-xl border-2 bg-card p-4 shadow-lg transition-all ${selected ? "border-violet-500 shadow-violet-500/30" : "border-violet-500/50"}`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-3 w-3 border-2 border-violet-500 bg-background"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="yes"
      className="h-3 w-3 border-2 border-emerald-500 bg-background"
      style={{ left: "30%" }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="no"
      className="h-3 w-3 border-2 border-red-500 bg-background"
      style={{ left: "70%" }}
    />
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
        <GitBranch className="h-5 w-5 text-violet-500" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-violet-500">
          Branch
        </p>
        <p className="font-semibold text-foreground">{data.label}</p>
      </div>
    </div>
    <div className="mt-3 flex justify-between text-xs">
      <span className="flex items-center gap-1 text-emerald-400">
        <Snowflake className="h-3 w-3" /> Cold
      </span>
      <span className="flex items-center gap-1 text-red-400">
        <Flame className="h-3 w-3" /> Warm
      </span>
    </div>
  </div>
);
