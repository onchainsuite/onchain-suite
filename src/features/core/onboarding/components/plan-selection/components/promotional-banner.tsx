export function PromotionalBanner() {
  return (
    <div className="mb-6 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-4 sm:mb-8 sm:p-6 dark:from-amber-900/20 dark:to-orange-900/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex-1">
          <h2 className="text-foreground mb-2 text-lg font-bold sm:text-xl">
            Try our Standard plan for 50% off!
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Spend less to grow more with 50% off for 12 months, even if you
            change to our Premium or Essentials plans. Cancel or downgrade to
            Free plan at any time.
          </p>
          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 sm:gap-4">
            {[
              "Generative AI features",
              "Custom-coded email templates",
              "Advanced segmentation & reporting",
              "Data-driven optimization tools",
              "Enhanced automations",
              "Personalized onboarding",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <div className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center lg:text-right">
          <div className="mb-2">
            <span className="text-muted-foreground text-sm">Starts at</span>
          </div>
          <div className="mb-1">
            <span className="text-muted-foreground text-xl font-bold line-through sm:text-2xl">
              $45
            </span>
            <span className="text-foreground ml-2 text-2xl font-bold sm:text-3xl">
              $23
            </span>
          </div>
          <div className="text-muted-foreground text-sm">
            Then $500/mo for 12 months
          </div>
        </div>
      </div>
    </div>
  );
}
