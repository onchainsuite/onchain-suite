import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Handle, Position } from "reactflow";

import { type AutomationNodeData } from "@/features/automation/types";

interface EmailNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const EmailNode = ({ data, selected }: EmailNodeProps) => (
  <div
    className={`min-w-[300px] rounded-2xl border bg-card p-5 shadow-md transition-all ${
      selected
        ? "border-indigo-500/60 shadow-indigo-500/10 ring-2 ring-indigo-500/25"
        : "border-border hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-lg"
    }`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-3.5 w-3.5 border-2 border-indigo-400 bg-background"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3.5 w-3.5 border-2 border-indigo-400 bg-background"
    />
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
        <EnvelopeIcon
          aria-hidden="true"
          className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
        />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-400">
          Send Email
        </p>
        <p className="font-semibold tracking-tight text-foreground">
          {data.label}
        </p>
      </div>
    </div>
    {data.template && (
      <div className="mt-3 space-y-2">
        <div className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 px-3 py-2.5">
          <p className="text-xs font-medium text-foreground">{data.template}</p>
          {data.subject && (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {data.subject}
            </p>
          )}
        </div>
        {data.dynamicFields && (
          <div className="flex flex-wrap gap-1">
            {data.dynamicFields.slice(0, 3).map((field: string) => (
              <span
                key={field}
                className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
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
