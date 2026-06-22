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
    className={`min-w-[220px] rounded-[22px] border bg-slate-950/95 p-4 shadow-[0_18px_40px_rgba(2,6,23,0.35)] transition-all ${selected ? "border-violet-400/60 shadow-violet-500/10" : "border-violet-500/20"}`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-3.5 w-3.5 border-2 border-violet-300 bg-slate-950"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3.5 w-3.5 border-2 border-violet-300 bg-slate-950"
    />
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/10">
        <HugeiconsIcon icon={Clock01Icon} className="h-5 w-5 text-violet-200" />
      </div>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-violet-200">
          Wait
        </p>
        <p className="font-semibold tracking-tight text-white">
          {data.duration ?? "3 days"}
        </p>
      </div>
    </div>
  </div>
);
