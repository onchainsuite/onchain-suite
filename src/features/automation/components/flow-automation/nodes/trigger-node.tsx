import { Zap } from "lucide-react";
import { Handle, Position } from "reactflow";

import { type AutomationNodeData } from "@/features/automation/types";

interface TriggerNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const TriggerNode = ({ data, selected }: TriggerNodeProps) => (
  <div
    className={`min-w-[296px] rounded-[22px] border bg-slate-950/95 p-4 shadow-[0_18px_40px_rgba(2,6,23,0.35)] transition-all ${selected ? "border-sky-400/60 shadow-sky-500/15" : "border-sky-500/20"}`}
  >
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3.5 w-3.5 border-2 border-sky-300 bg-slate-950"
    />
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/15 bg-sky-400/10">
        <Zap className="h-5 w-5 text-sky-300" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-sky-200">
          Trigger
        </p>
        <p className="font-semibold tracking-tight text-white">{data.label}</p>
      </div>
    </div>
    {data.contract && (
      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full border border-sky-500/20 bg-sky-400/10 px-2.5 py-1 text-[11px] font-medium text-sky-100">
            {data.contract}
          </span>
          <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300">
            {data.event}
          </span>
          {data.chain && data.chain === "All Chains" && (
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-100">
              {data.chain}
            </span>
          )}
        </div>
        {data.preview && (
          <div className="rounded-2xl border border-sky-500/10 bg-sky-400/5 px-3 py-2.5">
            <p className="text-xs leading-5 text-sky-100/90">{data.preview}</p>
          </div>
        )}
      </div>
    )}
  </div>
);
