"use client";

import {
  Copy,
  Edit,
  FileText,
  FileX,
  MoreHorizontal,
  Rss,
  Send,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { SavedSegment } from "@/r3tain/segment/types";

interface SegmentListItemProps {
  segment: SavedSegment;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReplicate?: (id: string) => void;
  onExport?: (id: string) => void;
}

export function SegmentListItem({
  segment,
  isSelected,
  onToggleSelection,
  onEdit,
  onDelete,
  onReplicate,
  onExport,
}: SegmentListItemProps) {
  return (
    <div className="border-border bg-card hover:bg-accent/50 flex items-center gap-4 rounded-lg border p-4 transition-colors">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelection(segment.id)}
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-primary cursor-pointer font-medium hover:underline">
          {segment.name}
        </h3>
      </div>
      <div className="text-muted-foreground text-sm">
        <div>Created</div>
        <div>{segment.created}</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onEdit?.(segment.id)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete?.(segment.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onReplicate?.(segment.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Replicate Segment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport?.(segment.id)}>
            <FileText className="mr-2 h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Send className="mr-2 h-4 w-4" />
            Send regular email
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileX className="mr-2 h-4 w-4" />
            Send plain-text email
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Rss className="mr-2 h-4 w-4" />
            Send RSS email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
