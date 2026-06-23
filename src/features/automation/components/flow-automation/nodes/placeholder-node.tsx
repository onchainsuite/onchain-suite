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
  <div className="min-w-[208px] rounded-2xl border border-dashed border-border bg-muted/40 p-4 transition-colors hover:border-primary/40">
    <Handle
      type="target"
      position={Position.Top}
      className="h-3.5 w-3.5 border-2 border-muted-foreground bg-background"
    />
    <div className="flex items-center justify-center gap-2 text-center">
      <HugeiconsIcon
        icon={Add01Icon}
        className="h-5 w-5 text-muted-foreground"
      />
      <div>
        <p className="font-medium text-foreground">{data.label}</p>
        <p className="mt-1 text-xs text-muted-foreground">Drag a node here</p>
      </div>
    </div>
  </div>
);
