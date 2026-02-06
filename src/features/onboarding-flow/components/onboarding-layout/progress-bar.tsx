interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="border-border bg-card border-t px-8 py-4 lg:px-16">
      <div className="flex items-center justify-between">
        <div className="hidden items-center gap-2 md:flex">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-2 w-16 rounded-full ${i + 1 <= currentStep ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
        <span className="text-muted-foreground text-sm">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
}
