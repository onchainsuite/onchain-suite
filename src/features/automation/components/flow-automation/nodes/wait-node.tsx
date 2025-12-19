import { Clock } from "lucide-react";
import React from "react";
import { Handle, Position } from "reactflow";

import { type AutomationNodeData } from "@/features/automation/types";

interface WaitNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const WaitNode = ({ data, selected }: WaitNodeProps) => (
  <div
    className={`min-w-[200px] rounded-xl border-2 bg-card p-4 shadow-lg transition-all ${selected ? "border-secondary shadow-secondary/30" : "border-secondary/50"}`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-3 w-3 border-2 border-secondary bg-background"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3 w-3 border-2 border-secondary bg-background"
    />
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
        <Clock className="h-5 w-5 text-secondary-foreground" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-secondary-foreground">
          Wait
        </p>
        <p className="font-semibold text-foreground">
          {data.duration ?? "3 days"}
        </p>
      </div>
    </div>
  </div>
);
