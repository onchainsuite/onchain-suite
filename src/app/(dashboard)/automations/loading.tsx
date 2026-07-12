"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AutomationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className="rounded-xl border border-border/50 bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/50 bg-card p-4">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={`row-${i}`}
              className="flex items-center gap-4"
            >
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="ml-auto h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
