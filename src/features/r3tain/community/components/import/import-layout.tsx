"use client";

import type React from "react";

import { ImportHeader } from "./import-header";
import { ProgressBreadcrumb } from "./progress-breadcrumb";
import { useBreadcrumb, useImportNavigation } from "@/r3tain/community/hooks";

interface ImportLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  onBack?: () => void;
  showBreadcrumb?: boolean;
}

export function ImportLayout({
  children,
  currentStep,
  onBack,
  showBreadcrumb = true,
}: ImportLayoutProps) {
  const { goBack, exitImport } = useImportNavigation();
  const { steps } = useBreadcrumb(currentStep);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Default back navigation based on current step
      const previousSteps = [
        "",
        "upload",
        "match",
        "organize",
        "tag",
        "subscribe",
        "complete",
      ];
      const previousStep = previousSteps[currentStep - 1];
      if (previousStep) {
        goBack(previousStep);
      }
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <ImportHeader onBack={handleBack} onExit={exitImport} />

      <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8 lg:py-8">
        {showBreadcrumb && (
          <div className="mb-8">
            <ProgressBreadcrumb steps={steps} />
          </div>
        )}

        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}
