"use client";

import { EmptyStateIllustration } from "./empty-state-illustration";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showIllustration?: boolean;
}

export function EmptyState({
  title = "Nothing to report yet",
  description = "After you send your first campaign, you'll be able to see information about how it performed.",
  showIllustration = true,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      {showIllustration && <EmptyStateIllustration />}
      <div className="max-w-md space-y-2">
        <h3 className="text-foreground text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
