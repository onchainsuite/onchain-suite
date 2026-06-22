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
    className={`min-w-[256px] rounded-[22px] border bg-slate-950/95 p-4 shadow-[0_18px_40px_rgba(2,6,23,0.35)] transition-all ${selected ? "border-cyan-400/60 shadow-cyan-500/10" : "border-cyan-500/20"}`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-3.5 w-3.5 border-2 border-cyan-300 bg-slate-950"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="yes"
      className="h-3.5 w-3.5 border-2 border-emerald-300 bg-slate-950"
      style={{ left: "30%" }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="no"
      className="h-3.5 w-3.5 border-2 border-orange-300 bg-slate-950"
      style={{ left: "70%" }}
    />
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10">
        <HugeiconsIcon icon={GitBranchIcon} className="h-5 w-5 text-cyan-200" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-cyan-200">
          Branch
        </p>
        <p className="font-semibold tracking-tight text-white">{data.label}</p>
      </div>
    </div>
    <div className="mt-3 flex justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs">
      <span className="flex items-center gap-1 text-emerald-200">
        <HugeiconsIcon icon={SnowIcon} className="h-3 w-3" /> Cold
      </span>
      <span className="flex items-center gap-1 text-orange-200">
        <HugeiconsIcon icon={FireIcon} className="h-3 w-3" /> Warm
      </span>
    </div>
  </div>
);
