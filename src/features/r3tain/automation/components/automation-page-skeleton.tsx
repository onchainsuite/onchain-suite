import { v4 as uuidV4 } from "uuid";

export function AutomationPageSkeleton() {
  return (
    <main className="flex-1 overflow-auto">
      {/* Page Header Skeleton */}
      <div className="border-border bg-card/50 border-b backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="bg-muted h-8 w-48 animate-pulse rounded-md" />
              <div className="bg-muted mt-2 h-4 w-64 animate-pulse rounded-md" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="bg-muted h-10 w-40 animate-pulse rounded-md" />
              <div className="bg-muted h-10 w-36 animate-pulse rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="bg-muted mb-4 h-6 w-32 animate-pulse rounded-full" />
              <div className="mb-6 space-y-3">
                <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
                <div className="bg-muted h-10 w-3/4 animate-pulse rounded-md" />
              </div>
              <div className="mb-8 space-y-2">
                <div className="bg-muted h-6 w-full animate-pulse rounded-md" />
                <div className="bg-muted h-6 w-2/3 animate-pulse rounded-md" />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="bg-muted h-12 w-32 animate-pulse rounded-md" />
                <div className="bg-muted h-12 w-48 animate-pulse rounded-md" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-muted h-96 w-48 animate-pulse rounded-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Flows Skeleton */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="bg-muted mx-auto mb-4 h-6 w-40 animate-pulse rounded-full" />
            <div className="bg-muted mx-auto mb-2 h-8 w-64 animate-pulse rounded-md" />
            <div className="bg-muted mx-auto h-4 w-96 animate-pulse rounded-md" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_) => (
              <div key={uuidV4()} className="bg-card rounded-lg border p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="bg-muted h-8 w-8 animate-pulse rounded-md" />
                  <div className="bg-muted h-6 w-16 animate-pulse rounded-full" />
                </div>
                <div className="bg-muted mb-2 h-6 w-3/4 animate-pulse rounded-md" />
                <div className="mb-4 space-y-2">
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md" />
                  <div className="bg-muted h-4 w-2/3 animate-pulse rounded-md" />
                </div>
                <div className="bg-muted h-4 w-24 animate-pulse rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Templates Skeleton */}
      <section className="bg-muted/30 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="bg-muted mx-auto mb-4 h-6 w-32 animate-pulse rounded-full" />
            <div className="bg-muted mx-auto mb-2 h-8 w-56 animate-pulse rounded-md" />
            <div className="bg-muted mx-auto h-4 w-80 animate-pulse rounded-md" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_) => (
              <div key={uuidV4()} className="bg-card rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="bg-muted h-6 w-6 animate-pulse rounded-md" />
                  <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
                </div>
                <div className="bg-muted mb-2 h-5 w-3/4 animate-pulse rounded-md" />
                <div className="space-y-1">
                  <div className="bg-muted h-3 w-full animate-pulse rounded-md" />
                  <div className="bg-muted h-3 w-2/3 animate-pulse rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section Skeleton */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="bg-muted mx-auto mb-4 h-6 w-36 animate-pulse rounded-full" />
            <div className="bg-muted mx-auto mb-2 h-8 w-72 animate-pulse rounded-md" />
            <div className="bg-muted mx-auto h-4 w-96 animate-pulse rounded-md" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map(() => (
              <div
                key={uuidV4()}
                className="bg-card overflow-hidden rounded-lg border"
              >
                <div className="bg-muted aspect-video animate-pulse" />
                <div className="p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="bg-muted h-5 w-5 animate-pulse rounded-md" />
                    <div className="bg-muted h-5 w-20 animate-pulse rounded-full" />
                  </div>
                  <div className="bg-muted mb-2 h-6 w-3/4 animate-pulse rounded-md" />
                  <div className="mb-4 space-y-2">
                    <div className="bg-muted h-4 w-full animate-pulse rounded-md" />
                    <div className="bg-muted h-4 w-2/3 animate-pulse rounded-md" />
                  </div>
                  <div className="bg-muted h-4 w-24 animate-pulse rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Skeleton */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="mb-6 h-10 w-32 animate-pulse rounded-md bg-white/20" />
              <div className="mb-6 h-8 w-8 animate-pulse rounded-md bg-white/20" />
              <div className="mb-8 space-y-4">
                <div className="h-8 w-full animate-pulse rounded-md bg-white/20" />
                <div className="h-8 w-3/4 animate-pulse rounded-md bg-white/20" />
                <div className="h-8 w-1/2 animate-pulse rounded-md bg-white/20" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-64 animate-pulse rounded-md bg-white/20" />
                <div className="h-4 w-32 animate-pulse rounded-md bg-white/20" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="h-96 w-80 animate-pulse rounded-lg bg-white/20" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
