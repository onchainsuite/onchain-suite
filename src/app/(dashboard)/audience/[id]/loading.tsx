export default function ProfileLoading() {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Sidebar skeleton */}
      <div className="hidden w-64 border-r border-gray-200 bg-white lg:block" />

      <main className="flex-1 px-4 py-10 md:px-12">
        <div className="mx-auto max-w-6xl space-y-10">
          {/* Back button skeleton */}
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
            <div className="h-10 w-32 animate-pulse rounded-full bg-gray-200" />
          </div>

          {/* Tags skeleton */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 w-20 animate-pulse rounded-full bg-gray-200"
              />
            ))}
          </div>

          {/* Intelligence cards skeleton */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl bg-gray-200"
              />
            ))}
          </div>

          {/* Chart skeleton */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8">
            <div className="mb-6 h-6 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
          </div>

          {/* Stats grid skeleton */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl bg-gray-200"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
