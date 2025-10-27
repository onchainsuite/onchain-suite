import { v7 } from "uuid";

export function AllFlowsPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="bg-muted h-8 w-32 animate-pulse rounded-md" />
          <div className="bg-muted mt-2 h-4 w-64 animate-pulse rounded-md" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="bg-muted h-10 w-40 animate-pulse rounded-md" />
          <div className="bg-muted h-10 w-36 animate-pulse rounded-md" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="bg-muted h-10 w-full max-w-md animate-pulse rounded-md" />
          <div className="bg-muted h-10 w-40 animate-pulse rounded-md" />
          <div className="bg-muted h-10 w-40 animate-pulse rounded-md" />
        </div>
        <div className="bg-muted h-4 w-24 animate-pulse rounded-md" />
      </div>

      {/* Flow Items Skeleton */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={v7()} className="bg-card rounded-lg border p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <div className="bg-muted h-6 w-16 animate-pulse rounded-full" />
                  <div className="bg-muted h-4 w-32 animate-pulse rounded-md" />
                </div>
                <div className="bg-muted h-6 w-48 animate-pulse rounded-md" />
                <div className="bg-muted h-4 w-64 animate-pulse rounded-md" />
                <div className="flex gap-4">
                  <div className="bg-muted h-4 w-24 animate-pulse rounded-md" />
                  <div className="bg-muted h-4 w-20 animate-pulse rounded-md" />
                  <div className="bg-muted h-4 w-20 animate-pulse rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-muted h-9 w-24 animate-pulse rounded-md" />
                <div className="bg-muted h-8 w-8 animate-pulse rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="bg-muted h-4 w-48 animate-pulse rounded-md" />
        <div className="flex items-center gap-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={v7()}
              className="bg-muted h-8 w-8 animate-pulse rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
