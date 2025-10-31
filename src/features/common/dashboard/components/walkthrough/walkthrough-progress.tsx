"use client";

import { Progress } from "@/components/ui/progress";

interface WalkthroughProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WalkthroughProgress({
  currentStep,
  totalSteps,
}: WalkthroughProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="pt-2">
      <div className="flex justify-between mb-2">
        <span className="text-xs text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs text-muted-foreground">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
