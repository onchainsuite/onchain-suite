"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AutomationDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-full max-w-[520px]" />
          <Skeleton className="h-4 w-full max-w-[420px]" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`skeleton-${i}`}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <Skeleton className="h-6 w-24" />
            <Skeleton className="mt-3 h-8 w-16" />
            <Skeleton className="mt-2 h-4 w-28" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
