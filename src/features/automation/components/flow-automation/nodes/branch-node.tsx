import { Flame, GitBranch, Snowflake } from "lucide-react";
import React from "react";
import { Handle, Position } from "reactflow";

import { type AutomationNodeData } from "@/features/automation/types";

interface BranchNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const BranchNode = ({ data, selected }: BranchNodeProps) => (
  <div
    className={`min-w-[240px] rounded-xl border-2 bg-card p-4 shadow-lg transition-all ${selected ? "border-secondary shadow-secondary/30" : "border-secondary/50"}`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-3 w-3 border-2 border-secondary bg-background"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="yes"
      className="h-3 w-3 border-2 border-primary bg-background"
      style={{ left: "30%" }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="no"
      className="h-3 w-3 border-2 border-destructive bg-background"
      style={{ left: "70%" }}
    />
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
        <GitBranch className="h-5 w-5 text-secondary-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-secondary-foreground">
          Branch
        </p>
        <p className="font-semibold text-foreground">{data.label}</p>
      </div>
    </div>
    <div className="mt-3 flex justify-between text-xs">
      <span className="flex items-center gap-1 text-primary">
        <Snowflake className="h-3 w-3" /> Cold
      </span>
      <span className="flex items-center gap-1 text-destructive">
        <Flame className="h-3 w-3" /> Warm
      </span>
    </div>
  </div>
);
