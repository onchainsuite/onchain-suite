export default function AccountLoading() {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <div className="sticky top-4 hidden h-[calc(100vh-2rem)] w-20 md:block">
        <div className="h-full animate-pulse rounded-2xl bg-gray-200" />
      </div>
      <main className="flex-1 px-8 py-12 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="h-12 w-48 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-12 flex gap-8 border-b border-gray-200 pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-6 w-24 animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
          <div className="mt-16 space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl bg-gray-200"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
