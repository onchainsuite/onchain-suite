import { Archive, Check, Send, Star } from "lucide-react";
import React from "react";

interface FloatingBulkProps {
  selectedEmails: number[];
  setSelectedEmails: (ids: number[]) => void;
}

const FloatingBulk = ({
  selectedEmails,
  setSelectedEmails,
}: FloatingBulkProps) => {
  if (selectedEmails.length === 0) return null;

  return (
    <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
      <span className="text-sm font-medium">
        {selectedEmails.length} selected
      </span>
      <div className="h-4 w-px bg-border" />
      <button
        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
        title="Send Email"
      >
        <Send className="h-4 w-4" />
      </button>
      <button
        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-secondary"
        title="Star"
      >
        <Star className="h-4 w-4" />
      </button>
      <button
        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-secondary"
        title="Archive"
      >
        <Archive className="h-4 w-4" />
      </button>
      <button
        onClick={() => setSelectedEmails([])}
        className="ml-auto rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted"
        title="Clear selection"
      >
        <Check className="h-4 w-4" />
      </button>
    </div>
  );
};

export default FloatingBulk;
