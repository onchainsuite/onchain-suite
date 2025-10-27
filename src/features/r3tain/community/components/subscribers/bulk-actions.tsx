"use client";
import {
  Archive,
  Mail,
  MoreHorizontal,
  Tag,
  Trash2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Subscriber } from "@/r3tain/community/types";

interface BulkActionsProps {
  selectedSubscribers: Subscriber[];
  onTagSubscribers: (subscribers: Subscriber[]) => void;
  onEmailSubscription: (subscribers: Subscriber[]) => void;
  onArchive: (subscribers: Subscriber[]) => void;
  onDelete: (subscribers: Subscriber[]) => void;
}

export function BulkActions({
  selectedSubscribers,
  onTagSubscribers,
  onEmailSubscription,
  onArchive,
  onDelete,
}: BulkActionsProps) {
  const selectedCount = selectedSubscribers.length;

  if (selectedCount === 0) return null;

  return (
    <div className="border-border bg-muted mb-4 flex items-center gap-2 rounded-lg border p-4">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Users className="h-4 w-4" />
        <span className="font-medium">
          {selectedCount} subscriber{selectedCount > 1 ? "s" : ""} selected
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTagSubscribers(selectedSubscribers)}
          className="gap-2"
        >
          <Tag className="h-4 w-4" />
          Tag subscribers
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onEmailSubscription(selectedSubscribers)}
          className="gap-2"
        >
          <Mail className="h-4 w-4" />
          Email subscription
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onArchive(selectedSubscribers)}
          className="gap-2"
        >
          <Archive className="h-4 w-4" />
          Archive
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDelete(selectedSubscribers)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete subscribers
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
