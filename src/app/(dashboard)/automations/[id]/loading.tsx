export default function AutomationDetailLoading() {
  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex flex-1 flex-col">
        <div className="border-b border-border/40 bg-card px-8 py-6">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-10 w-96 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex-1 p-8">
          <div className="grid gap-6 md:grid-cols-4">
            {[...Array(4)].map((_, i) => {
              return (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`skeleton-${i}`}
                  className="h-32 animate-pulse rounded-xl bg-muted"
                />
              );
            })}
          </div>
          <div className="mt-6 h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </main>
    </div>
  );
}
