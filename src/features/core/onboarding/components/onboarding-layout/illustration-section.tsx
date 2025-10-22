interface IllustrationSectionProps {
  currentStep: number;
}

export function IllustrationSection({ currentStep }: IllustrationSectionProps) {
  const renderIllustration = () => {
    switch (currentStep) {
      case 6:
        return (
          <div className="mx-auto mb-8 h-64 w-80 rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <div className="mb-6 text-lg font-semibold">Your Audience</div>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"
                  style={{
                    backgroundImage: `url(/placeholder.svg?height=64&width=64&text=User${i + 1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ))}
            </div>
            <div className="mt-6 text-center">
              <div className="text-2xl font-bold">1,500+</div>
              <div className="text-muted-foreground text-sm">
                Potential Contacts
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="mx-auto mb-8 h-64 w-64 rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800">
            <div className="mb-4 text-center">
              <div className="mb-2 text-lg font-bold text-purple-700 dark:text-purple-300">
                TANDU
              </div>
              <div className="mb-2 h-4 w-full rounded bg-slate-200 dark:bg-slate-600" />
              <div className="mx-auto h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-600" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="h-12 rounded bg-amber-200 dark:bg-amber-700" />
              <div className="h-12 rounded bg-green-200 dark:bg-green-700" />
              <div className="h-12 rounded bg-blue-200 dark:bg-blue-700" />
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-600" />
              <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-600" />
              <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-600" />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="mx-auto mb-8 h-64 w-80 rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <div className="mb-4 text-lg font-semibold">Performance</div>
            <div className="flex h-32 items-end justify-center gap-2">
              <div
                className="w-8 rounded-t bg-green-500"
                style={{ height: "40%" }}
              />
              <div
                className="w-8 rounded-t bg-green-500"
                style={{ height: "60%" }}
              />
              <div
                className="w-8 rounded-t bg-green-500"
                style={{ height: "80%" }}
              />
              <div
                className="w-8 rounded-t bg-green-500"
                style={{ height: "100%" }}
              />
            </div>
            <div className="text-muted-foreground mt-4 flex justify-between text-xs">
              <span>0%</span>
              <span>20%</span>
              <span>40%</span>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="mx-auto mb-8 h-64 w-80 rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                  <div className="h-3 w-3 rounded-full bg-white" />
                </div>
                <span className="text-sm">Contact signs up for newsletter</span>
              </div>
              <div className="flex justify-center">
                <div className="h-8 w-px bg-slate-300 dark:bg-slate-600" />
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-600">
                  <div className="h-3 w-3 rounded-full bg-slate-500" />
                </div>
                <span className="text-sm">Wait 1 day</span>
              </div>
              <div className="flex justify-center">
                <div className="h-8 w-px bg-slate-300 dark:bg-slate-600" />
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500">
                  <div className="h-3 w-3 rounded-full bg-white" />
                </div>
                <span className="text-sm">Send product discount code</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="mx-auto mb-8 h-64 w-64 rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-linear-to-r from-purple-500 to-pink-500" />
              <div>
                <div className="mb-1 h-6 w-20 rounded bg-slate-800 dark:bg-slate-200" />
                <div className="h-3 w-16 rounded bg-slate-400" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-600" />
              <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-600" />
              <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-600" />
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-600" />
              <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-600" />
              <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-600" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="hidden bg-linear-to-br from-amber-100 to-amber-200 lg:flex lg:items-center lg:justify-center lg:p-16 dark:from-amber-900/20 dark:to-amber-800/20">
      <div className="text-center">{renderIllustration()}</div>
    </div>
  );
}
