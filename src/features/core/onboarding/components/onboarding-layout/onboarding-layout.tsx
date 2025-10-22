"use client";

import { type ReactNode, useState } from "react";

import { IllustrationSection } from "./illustration-section";
import { LayoutHeader } from "./layout-header";
import { ProgressBar } from "./progress-bar";
import { SecurityBanner } from "./security-banner";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
}: OnboardingLayoutProps) {
  const [showBanner, setShowBanner] = useState(true);

  const removeBanner = () => setShowBanner(false);

  return (
    <div className="bg-background min-h-screen">
      {showBanner && <SecurityBanner onRemove={removeBanner} />}
      <LayoutHeader />

      <main className="mx-auto max-w-7xl">
        {currentStep === 7 ? (
          // Full width for plan selection
          <div className="min-h-[calc(100vh-140px)] px-8 py-12">{children}</div>
        ) : (
          <div className="grid min-h-[calc(100vh-140px)] grid-cols-1 lg:grid-cols-2">
            {/* Form Section */}
            <div className="flex flex-col justify-center px-8 py-12 lg:px-16">
              {children}
            </div>

            {/* Illustration Section */}
            <IllustrationSection currentStep={currentStep} />
          </div>
        )}

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </main>
    </div>
  );
}
