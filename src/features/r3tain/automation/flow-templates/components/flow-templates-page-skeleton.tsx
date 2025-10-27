import { v7 } from "uuid";

export function FlowTemplatesPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="bg-muted h-8 w-40 animate-pulse rounded-md" />
          <div className="bg-muted mt-2 h-4 w-80 animate-pulse rounded-md" />
        </div>
        <div className="bg-muted h-10 w-36 animate-pulse rounded-md" />
      </div>

      {/* Search and Filters Skeleton */}
      <div className="space-y-4">
        <div className="bg-muted h-10 w-80 animate-pulse rounded-md" />
        <div className="bg-muted h-10 w-40 animate-pulse rounded-md" />
      </div>

      {/* Template Categories Skeleton */}
      {[...Array(3)].map((_) => (
        <section key={v7()} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-muted h-6 w-48 animate-pulse rounded-md" />
              <div className="bg-muted h-6 w-24 animate-pulse rounded-full" />
            </div>
            <div className="bg-muted h-4 w-96 animate-pulse rounded-md" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_) => (
              <div key={v7()} className="bg-card rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="bg-muted h-8 w-8 animate-pulse rounded-md" />
                  <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
                </div>
                <div className="bg-muted mb-2 h-5 w-3/4 animate-pulse rounded-md" />
                <div className="mb-4 space-y-2">
                  <div className="bg-muted h-3 w-full animate-pulse rounded-md" />
                  <div className="bg-muted h-3 w-2/3 animate-pulse rounded-md" />
                </div>
                <div className="mb-3 flex gap-1">
                  <div className="bg-muted h-4 w-12 animate-pulse rounded-full" />
                  <div className="bg-muted h-4 w-16 animate-pulse rounded-full" />
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="bg-muted h-3 w-16 animate-pulse rounded-md" />
                  <div className="bg-muted h-4 w-20 animate-pulse rounded-full" />
                </div>
                <div className="space-y-1">
                  <div className="bg-muted h-3 w-full animate-pulse rounded-md" />
                  <div className="bg-muted h-3 w-3/4 animate-pulse rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
