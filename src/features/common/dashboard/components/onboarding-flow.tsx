"use client";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Mail,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { OnboardingHeader } from "./onboarding/onboarding-header";
import { OnboardingProgress } from "./onboarding/onboarding-progress";
import { Onch3nSetupStep } from "./setup/onch3n-setup-step";
import { R3tainSetupStep } from "./setup/r3tain-setup-step";
import { UniversalSetupStep } from "./setup/universal-setup-step";
import type { SetupData } from "@/common/dashboard/types";

interface OnboardingFlowProps {
  onComplete: (data: SetupData) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<SetupData>({
    projectName: "",
    projectType: "DeFi",
    email: "",
    analyticsConsent: true,
    retentionGoal: 70,
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    toast.success(
      `Setup Complete!, Welcome to OnchainSuite, ${formData.projectName}! 🎉`
    );
    onComplete(formData);
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.projectName.length > 0;
    }
    if (step === 2) {
      return formData.email.length > 0;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <OnboardingHeader />
        <OnboardingProgress currentStep={step} totalSteps={totalSteps} />

        <Card className="bg-background/80 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              {step === 1 && <Wallet className="h-6 w-6 text-primary" />}
              {step === 2 && <Mail className="h-6 w-6 text-primary" />}
              {step === 3 && <BarChart3 className="h-6 w-6 text-primary" />}
              <CardTitle>
                {step === 1 && "Universal Setup"}
                {step === 2 && "R3tain Email Setup"}
                {step === 3 && "Onch3n Analytics"}
              </CardTitle>
            </div>
            <CardDescription>
              {step === 1 &&
                "Connect your wallet and tell us about your project (30 seconds)"}
              {step === 2 &&
                "Configure your email automation for campaigns (45 seconds)"}
              {step === 3 &&
                "Set up analytics and webhooks for insights (30 seconds)"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <UniversalSetupStep
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {step === 2 && (
              <R3tainSetupStep formData={formData} setFormData={setFormData} />
            )}
            {step === 3 && (
              <Onch3nSetupStep formData={formData} setFormData={setFormData} />
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 bg-transparent"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1"
              >
                {step === totalSteps ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Time Estimate */}
            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                {step === 1 && "⏱️ About 30 seconds remaining"}
                {step === 2 && "⏱️ About 45 seconds remaining"}
                {step === 3 && "⏱️ Almost done! 30 seconds"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-white/50">
            Privacy-first • ZK-secured • No passwords needed
          </p>
        </div>
      </div>
    </div>
  );
}
