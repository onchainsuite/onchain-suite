"use client";

import type { AiCitation } from "./use-ai-answer";

/** Compact clickable source list rendered under a finished AI answer. */
export function AiCitations({ citations }: { citations: AiCitation[] }) {
  if (citations.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/60 px-4 py-2 text-[11px] text-muted-foreground">
      <span className="font-medium">Sources</span>
      {citations.map((citation) => (
        <a
          key={citation.url}
          href={citation.url}
          target="_blank"
          rel="noreferrer noopener"
          className="max-w-[16rem] truncate underline-offset-2 hover:text-foreground hover:underline"
          title={citation.url}
        >
          {citation.title}
        </a>
      ))}
    </div>
  );
}
