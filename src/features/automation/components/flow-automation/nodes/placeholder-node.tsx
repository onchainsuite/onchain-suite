import React from "react";
import { Handle, Position } from "reactflow";
import { Plus } from "lucide-react";
import { AutomationNodeData } from "@/features/automation/types";

interface PlaceholderNodeProps {
  data: AutomationNodeData;
  selected: boolean;
}

export const PlaceholderNode = ({ data, selected }: PlaceholderNodeProps) => (
  <div className="min-w-[200px] rounded-xl border-2 border-dashed border-muted-foreground/30 bg-card/50 p-4">
    <Handle
      type="target"
      position={Position.Top}
      className="h-3 w-3 border-2 border-muted-foreground bg-background"
    />
    <div className="flex items-center justify-center gap-2 text-center">
      <Plus className="h-5 w-5 text-muted-foreground/50" />
      <div>
        <p className="font-medium text-muted-foreground">{data.label}</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Drag a node here
        </p>
      </div>
    </div>
  </div>
);
