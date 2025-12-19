import { Archive, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

import { type Email } from "../types";

interface ConversationHeaderProps {
  selectedEmail: Email;
}

const ConversationHeader = ({ selectedEmail }: ConversationHeaderProps) => {
  return (
    <div className="border-b border-border p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="mb-1 text-lg font-medium">{selectedEmail.subject}</h2>
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {selectedEmail.campaign}
            </span>
            <Link
              href={`/audience/${selectedEmail.profileId}`}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              View profile
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card">
            <Archive className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card">
            <Trash2 className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
