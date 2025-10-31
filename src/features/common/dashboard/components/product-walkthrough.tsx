"use client";

import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DashboardOverviewStep,
  Onch3nStep,
  R3tainStep,
  StepIndicators,
  ThreeRidgeStep,
  WalkthroughProgress,
} from "./walkthrough";

interface ProductWalkthroughProps {
  onComplete: () => void;
  projectName: string;
}

export function ProductWalkthrough({
  onComplete,
  projectName,
}: ProductWalkthroughProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8 border-primary/30 bg-card/95 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary shrink-0" />
              <CardTitle className="text-lg md:text-xl truncate">
                Welcome to OnchainSuite, {projectName}!
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="shrink-0"
            >
              Skip Tour
            </Button>
          </div>
          <CardDescription className="text-sm">
            Let&apos;s take a quick tour of your retention platform (60 seconds)
          </CardDescription>

          <WalkthroughProgress currentStep={step} totalSteps={totalSteps} />
        </CardHeader>

        <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto">
          {step === 1 && <ThreeRidgeStep />}
          {step === 2 && <R3tainStep />}
          {step === 3 && <Onch3nStep />}
          {step === 4 && <DashboardOverviewStep />}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-card pb-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1">
              {step === totalSteps ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Enter Dashboard
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <StepIndicators currentStep={step} totalSteps={totalSteps} />
        </CardContent>
      </Card>
    </div>
  );
}
