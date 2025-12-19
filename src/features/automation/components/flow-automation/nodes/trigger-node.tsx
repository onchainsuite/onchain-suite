import React from "react";
import { Handle, Position } from "reactflow";
import { Zap } from "lucide-react";
import { AutomationNodeData } from "@/features/automation/types";

interface TriggerNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const TriggerNode = ({ data, selected }: TriggerNodeProps) => (
  <div
    className={`min-w-[280px] rounded-xl border-2 bg-card p-4 shadow-lg transition-all ${selected ? "border-emerald-500 shadow-emerald-500/30" : "border-emerald-500/50 shadow-emerald-500/20"}`}
  >
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3 w-3 border-2 border-emerald-500 bg-background"
    />
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
        <Zap className="h-5 w-5 text-emerald-500" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">
          Trigger
        </p>
        <p className="font-semibold text-foreground">{data.label}</p>
      </div>
    </div>
    {data.contract && (
      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
            {data.contract}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {data.event}
          </span>
          {data.chain && data.chain == "All Chains" && (
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-400">
              {data.chain}
            </span>
          )}
        </div>
        {data.preview && (
          <div className="rounded-lg bg-emerald-500/10 px-3 py-2">
            <p className="text-xs text-emerald-400">{data.preview}</p>
          </div>
        )}
      </div>
    )}
  </div>
);
