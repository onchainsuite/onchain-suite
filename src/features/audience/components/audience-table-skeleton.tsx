"use client";

const SKELETON_ROW_KEYS = Array.from({ length: 8 }).map((_, i) => `row-${i}`);

export function AudienceTableSkeleton() {
  return (
    <div
      className="mx-2 space-y-6 md:mx-0"
      aria-busy="true"
      aria-label="Loading audience"
      role="status"
    >
      <div className="sr-only" aria-live="polite">
        Loading audience…
      </div>
      <div className="flex items-center justify-between rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded skeleton-wave" />
          <div className="h-4 w-64 rounded skeleton-wave" />
        </div>
        <div className="hidden h-4 w-32 rounded skeleton-wave sm:block" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <div className="h-10 w-full rounded-lg border border-border bg-card px-4">
            <div className="mt-3 h-4 w-40 rounded skeleton-wave" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-10 w-32 rounded-lg border border-border bg-card px-3">
            <div className="mt-3 h-4 w-20 rounded skeleton-wave" />
          </div>
          <div className="h-10 w-32 rounded-lg border border-border bg-card px-3">
            <div className="mt-3 h-4 w-20 rounded skeleton-wave" />
          </div>
          <div className="h-10 w-28 rounded-lg border border-border bg-card px-3">
            <div className="mt-3 h-4 w-16 rounded skeleton-wave" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full" aria-hidden="true">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-12 px-4 py-3">
                  <div className="h-4 w-4 rounded skeleton-wave" />
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Profile
                  </span>
                </th>
                <th className="hidden px-4 py-3 text-left sm:table-cell">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Wallet
                  </span>
                </th>
                <th className="hidden px-4 py-3 text-left md:table-cell">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Socials
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Health
                  </span>
                </th>
                <th className="hidden px-4 py-3 text-left md:table-cell">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Last Action
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="animate-pulse">
              {SKELETON_ROW_KEYS.map((key) => (
                <tr key={key} className="border-b border-border last:border-0">
                  <td className="w-12 px-4 py-4">
                    <div className="h-4 w-4 rounded skeleton-wave" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full skeleton-wave" />
                      <div className="min-w-0">
                        <div className="h-4 w-36 rounded skeleton-wave" />
                        <div className="mt-2 h-3 w-44 rounded skeleton-wave opacity-70" />
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 sm:table-cell">
                    <div className="h-6 w-36 rounded skeleton-wave" />
                  </td>
                  <td className="hidden px-4 py-4 md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg skeleton-wave" />
                      <div className="h-7 w-7 rounded-lg skeleton-wave opacity-80" />
                      <div className="h-7 w-7 rounded-lg skeleton-wave opacity-60" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-10 rounded skeleton-wave" />
                      <div className="h-2 w-24 overflow-hidden rounded-full skeleton-wave" />
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 md:table-cell">
                    <div className="h-3 w-40 rounded skeleton-wave" />
                    <div className="mt-2 h-3 w-28 rounded skeleton-wave opacity-70" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
