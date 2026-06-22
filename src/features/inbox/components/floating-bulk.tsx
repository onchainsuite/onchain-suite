import {
  ArchiveIcon,
  SentIcon,
  StarIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

interface FloatingBulkProps {
  selectedThreadIds: string[];
  setSelectedThreadIds: (ids: string[]) => void;
}

const FloatingBulk = ({
  selectedThreadIds,
  setSelectedThreadIds,
}: FloatingBulkProps) => {
  if (selectedThreadIds.length === 0) return null;

  return (
    <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
      <span className="text-sm font-medium">
        {selectedThreadIds.length} selected
      </span>
      <div className="h-4 w-px bg-border" />
      <button
        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
        title="Send Email"
      >
        <HugeiconsIcon icon={SentIcon} className="h-4 w-4" />
      </button>
      <button
        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-secondary"
        title="Star"
      >
        <HugeiconsIcon icon={StarIcon} className="h-4 w-4" />
      </button>
      <button
        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-secondary"
        title="Archive"
      >
        <HugeiconsIcon icon={ArchiveIcon} className="h-4 w-4" />
      </button>
      <button
        onClick={() => setSelectedThreadIds([])}
        className="ml-auto rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted"
        title="Clear selection"
      >
        <HugeiconsIcon icon={Tick01Icon} className="h-4 w-4" />
      </button>
    </div>
  );
};

export default FloatingBulk;
