import React from "react";
import { Handle, Position } from "reactflow";
import { Clock } from "lucide-react";
import { AutomationNodeData } from "@/features/automation/types";

interface WaitNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const WaitNode = ({ data, selected }: WaitNodeProps) => (
  <div
    className={`min-w-[200px] rounded-xl border-2 bg-card p-4 shadow-lg transition-all ${selected ? "border-amber-500 shadow-amber-500/30" : "border-amber-500/50"}`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-3 w-3 border-2 border-amber-500 bg-background"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3 w-3 border-2 border-amber-500 bg-background"
    />
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
        <Clock className="h-5 w-5 text-amber-500" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-amber-500">
          Wait
        </p>
        <p className="font-semibold text-foreground">
          {data.duration || "3 days"}
        </p>
      </div>
    </div>
  </div>
);
