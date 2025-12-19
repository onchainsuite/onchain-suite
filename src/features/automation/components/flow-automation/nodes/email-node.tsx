import React from "react";
import { Handle, Position } from "reactflow";
import { Mail } from "lucide-react";
import { AutomationNodeData } from "@/features/automation/types";

interface EmailNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const EmailNode = ({ data, selected }: EmailNodeProps) => (
  <div
    className={`min-w-[260px] rounded-xl border-2 bg-card p-4 shadow-lg transition-all ${selected ? "border-indigo-500 shadow-indigo-500/30" : "border-indigo-500/50"}`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-3 w-3 border-2 border-indigo-500 bg-background"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3 w-3 border-2 border-indigo-500 bg-background"
    />
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
        <Mail className="h-5 w-5 text-indigo-500" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
          Send Email
        </p>
        <p className="font-semibold text-foreground">{data.label}</p>
      </div>
    </div>
    {data.template && (
      <div className="mt-3 space-y-2">
        <div className="rounded-lg bg-indigo-500/10 px-3 py-2">
          <p className="text-xs font-medium text-indigo-400">{data.template}</p>
          {data.subject && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {data.subject}
            </p>
          )}
        </div>
        {data.dynamicFields && (
          <div className="flex flex-wrap gap-1">
            {data.dynamicFields.slice(0, 3).map((field: string) => (
              <span
                key={field}
                className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {field}
              </span>
            ))}
            {data.dynamicFields.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{data.dynamicFields.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    )}
  </div>
);
