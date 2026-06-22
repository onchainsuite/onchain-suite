import { Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Handle, Position } from "reactflow";

import { type AutomationNodeData } from "@/features/automation/types";

interface EmailNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const EmailNode = ({ data, selected }: EmailNodeProps) => (
  <div
    className={`min-w-[272px] rounded-[22px] border bg-slate-950/95 p-4 shadow-[0_18px_40px_rgba(2,6,23,0.35)] transition-all ${selected ? "border-sky-400/60 shadow-sky-500/15" : "border-sky-500/20"}`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-3.5 w-3.5 border-2 border-sky-300 bg-slate-950"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3.5 w-3.5 border-2 border-sky-300 bg-slate-950"
    />
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/15 bg-sky-400/10">
        <HugeiconsIcon icon={Mail01Icon} className="h-5 w-5 text-sky-200" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-sky-200">
          Send Email
        </p>
        <p className="font-semibold tracking-tight text-white">{data.label}</p>
      </div>
    </div>
    {data.template && (
      <div className="mt-3 space-y-2">
        <div className="rounded-2xl border border-sky-500/10 bg-sky-400/5 px-3 py-2.5">
          <p className="text-xs font-medium text-sky-100">{data.template}</p>
          {data.subject && (
            <p className="mt-1 line-clamp-1 text-xs text-slate-400">
              {data.subject}
            </p>
          )}
        </div>
        {data.dynamicFields && (
          <div className="flex flex-wrap gap-1">
            {data.dynamicFields.slice(0, 3).map((field: string) => (
              <span
                key={field}
                className="rounded-md border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400"
              >
                {field}
              </span>
            ))}
            {data.dynamicFields.length > 3 && (
              <span className="text-[10px] text-slate-500">
                +{data.dynamicFields.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    )}
  </div>
);
