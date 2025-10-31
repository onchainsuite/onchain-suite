"use client";

import { v7 } from "uuid";

interface StepIndicatorsProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicators({
  currentStep,
  totalSteps,
}: StepIndicatorsProps) {
  return (
    <div className="flex justify-center gap-2 pt-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={v7()}
          className={`h-2 w-2 rounded-full transition-colors ${
            i + 1 === currentStep
              ? "bg-primary"
              : i + 1 < currentStep
                ? "bg-primary/50"
                : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}
