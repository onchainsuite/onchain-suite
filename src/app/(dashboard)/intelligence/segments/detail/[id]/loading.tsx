"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="space-y-3">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
