"use client";

import { useMemo } from "react";

export interface BreadcrumbStep {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

export function useBreadcrumb(currentStep: number) {
  const steps = useMemo(() => {
    const stepLabels = [
      "Choose Method",
      "Upload",
      "Match",
      "Organize",
      "Tag",
      "Subscribe",
      "Complete",
      "Confirmation",
    ];

    return stepLabels.map((label, index) => ({
      label,
      isActive: index === currentStep,
      isCompleted: index < currentStep,
    }));
  }, [currentStep]);

  return { steps };
}
