import { Zap } from "lucide-react";
import React from "react";
import { Handle, Position } from "reactflow";

import { type AutomationNodeData } from "@/features/automation/types";

interface TriggerNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const TriggerNode = ({ data, selected }: TriggerNodeProps) => (
  <div
    className={`min-w-[280px] rounded-xl border-2 bg-card p-4 shadow-lg transition-all ${selected ? "border-primary shadow-primary/30" : "border-primary/50 shadow-primary/20"}`}
  >
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3 w-3 border-2 border-primary bg-background"
    />
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
        <Zap className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Trigger
        </p>
        <p className="font-semibold text-foreground">{data.label}</p>
      </div>
    </div>
    {data.contract && (
      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
            {data.contract}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {data.event}
          </span>
          {data.chain && data.chain === "All Chains" && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {data.chain}
            </span>
          )}
        </div>
        {data.preview && (
          <div className="rounded-lg bg-primary/10 px-3 py-2">
            <p className="text-xs text-primary">{data.preview}</p>
          </div>
        )}
      </div>
    )}
  </div>
);
