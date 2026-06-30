import { ClockIcon } from "@heroicons/react/24/outline";
import { Handle, Position } from "reactflow";

import { type AutomationNodeData } from "@/features/automation/types";

interface WaitNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const WaitNode = ({ data, selected }: WaitNodeProps) => (
  <div
    className={`min-w-[244px] rounded-2xl border bg-card p-5 shadow-md transition-all ${
      selected
        ? "border-violet-500/60 shadow-violet-500/10 ring-2 ring-violet-500/25"
        : "border-border hover:-translate-y-0.5 hover:border-violet-500/40 hover:shadow-lg"
    }`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="h-3.5 w-3.5 border-2 border-violet-400 bg-background"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="h-3.5 w-3.5 border-2 border-violet-400 bg-background"
    />
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
        <ClockIcon
          aria-hidden="true"
          className="h-5 w-5 text-violet-600 dark:text-violet-400"
        />
      </div>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-violet-600 dark:text-violet-400">
          Wait
        </p>
        <p className="font-semibold tracking-tight text-foreground">
          {data.duration ?? "3 days"}
        </p>
      </div>
    </div>
  </div>
);
