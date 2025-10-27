import { v7 } from "uuid";

export function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Skeleton for Email Performance */}
      <div className="border-border bg-card animate-pulse rounded-lg border shadow-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <div className="bg-muted h-6 w-40 rounded-md" />
            <div className="bg-muted h-4 w-4 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-muted h-8 w-32 rounded-md" />
            <div className="bg-muted h-8 w-24 rounded-md" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="mb-8">
            <div className="bg-muted h-4 w-48 rounded-md" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_) => (
                <div
                  key={v7()}
                  className="bg-muted/10 space-y-3 rounded-lg border p-4"
                >
                  <div className="bg-muted h-4 w-20 rounded-md" />
                  <div className="bg-muted h-8 w-16 rounded-md" />
                  <div className="bg-muted h-3 w-12 rounded-md" />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Skeleton for Audience Section */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="border-border bg-card animate-pulse rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="bg-muted h-6 w-24 rounded-md" />
            <div className="flex items-center gap-3">
              <div className="bg-muted h-8 w-32 rounded-md" />
              <div className="bg-muted h-8 w-24 rounded-md" />
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="bg-muted/10 space-y-3 rounded-lg border p-4">
              <div className="bg-muted h-4 w-32 rounded-md" />
              <div className="bg-muted h-10 w-28 rounded-md" />
              <div className="flex items-center gap-2">
                <div className="bg-muted h-4 w-4 rounded-md" />
                <div className="bg-muted h-4 w-16 rounded-md" />
                <div className="bg-muted h-4 w-48 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-border bg-card animate-pulse rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="bg-muted h-6 w-48 rounded-md" />
            <div className="bg-muted h-8 w-32 rounded-md" />
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-muted h-4 w-full rounded-md" />
                <div className="bg-muted h-4 w-full rounded-md" />
                <div className="bg-muted h-4 w-full rounded-md" />
                <div className="bg-muted h-4 w-full rounded-md" />
              </div>
              {Array(5)
                .fill(0)
                .map((_) => (
                  <div
                    key={v7()}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <div className="bg-muted h-4 w-full rounded-md" />
                    <div className="bg-muted h-6 w-24 rounded-md" />
                    <div className="bg-muted h-4 w-16 rounded-md" />
                    <div className="flex justify-end">
                      <div className="bg-muted h-8 w-8 rounded-md" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton for Automations Section */}
      <div className="border-border bg-card animate-pulse rounded-lg border shadow-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <div className="bg-muted h-6 w-32 rounded-md" />
            <div className="bg-muted h-4 w-4 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-muted h-8 w-32 rounded-md" />
            <div className="bg-muted h-8 w-24 rounded-md" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="mb-8">
            <div className="bg-muted h-4 w-96 rounded-md" />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_) => (
                <div
                  key={v7()}
                  className="bg-muted/10 space-y-3 rounded-lg border p-4"
                >
                  <div className="bg-muted h-4 w-32 rounded-md" />
                  <div className="bg-muted h-8 w-16 rounded-md" />
                </div>
              ))}
          </div>

          <div className="overflow-hidden">
            <div className="bg-muted mb-4 h-8 w-full rounded-md" />
            {Array(3)
              .fill(0)
              .map((_) => (
                <div
                  key={v7()}
                  className="bg-muted mb-2 h-16 w-full rounded-md"
                />
              ))}
          </div>
        </div>
      </div>

      {/* Skeleton for Email Tagged Contacts */}
      <div className="border-border bg-card animate-pulse rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-6">
            <div className="shrink-0">
              <div className="bg-muted h-16 w-24 rounded-md" />
            </div>
            <div className="flex-1">
              <div className="bg-muted mb-2 h-6 w-48 rounded-md" />
              <div className="bg-muted mb-4 h-4 w-72 rounded-md" />
              <div className="bg-muted h-8 w-40 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
