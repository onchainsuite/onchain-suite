import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Handle, Position } from "reactflow";

import { type AutomationNodeData } from "@/features/automation/types";

interface PlaceholderNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const PlaceholderNode = ({
  data,
  selected: _selected,
}: PlaceholderNodeProps) => (
  <div className="min-w-[208px] rounded-[22px] border border-dashed border-slate-700 bg-slate-950/70 p-4 shadow-[0_18px_40px_rgba(2,6,23,0.2)]">
    <Handle
      type="target"
      position={Position.Top}
      className="h-3.5 w-3.5 border-2 border-slate-500 bg-slate-950"
    />
    <div className="flex items-center justify-center gap-2 text-center">
      <HugeiconsIcon icon={Add01Icon} className="h-5 w-5 text-slate-500" />
      <div>
        <p className="font-medium text-slate-300">{data.label}</p>
        <p className="mt-1 text-xs text-slate-500">Drag a node here</p>
      </div>
    </div>
  </div>
);
