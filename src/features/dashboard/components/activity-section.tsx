import { Mail, Sparkle, Target } from "lucide-react";

const metrics = [
  { label: "Emails", value: 0, icon: Mail },
  { label: "Enrichment", value: 0, icon: Sparkle },
  { label: "Qualification", value: 0, icon: Target },
];

export function ActivitySection() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground md:text-xl">
          Your Activity
        </h2>
        <p className="text-xs text-muted-foreground md:text-sm">Past 7 days</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <Icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </p>
              <p className="mt-1 text-3xl font-semibold text-foreground">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
