"use client";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Globe,
  Mail,
  X,
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
import { Progress } from "@/components/ui/progress";

import { AnalyticsSetupStep, EmailSetupStep, ProjectSetupStep } from "./setup";
import type { SetupData } from "@/common/dashboard/types";

interface SetupFlowProps {
  onComplete: (data: SetupData) => void;
  onDismiss: () => void;
}

export function SetupFlow({ onComplete, onDismiss }: SetupFlowProps) {
  const [step, setStep] = useState(1);

  const [projectTypeOpen, setProjectTypeOpen] = useState(false);

  const [formData, setFormData] = useState<SetupData>({
    projectName: "",
    projectType: "DeFi",
    email: "",
    analyticsConsent: true,
    retentionGoal: 70,
  });

  const isWeb3Project = () => {
    const web3Types = ["DeFi", "Gaming", "DAO", "NFT Marketplace"];
    return web3Types.includes(formData.projectType);
  };

  const isValidContractAddress = (address: string) => {
    if (!address) return true;
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

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
      `Setup Complete!,Welcome to OnchainSuite, ${formData.projectName}!`
    );
    onComplete(formData);
  };

  const canProceed = () => {
    if (step === 1) {
      if (
        formData.contractAddress &&
        !isValidContractAddress(formData.contractAddress)
      ) {
        return false;
      }
      return formData.projectName.length > 0;
    }
    if (step === 2) {
      return formData.email.length > 0;
    }
    return true;
  };

  return (
    <Card className="border-primary/30 bg-card/95 backdrop-blur-xl shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {step === 1 && <Globe className="h-6 w-6 text-primary" />}
            {step === 2 && <Mail className="h-6 w-6 text-primary" />}
            {step === 3 && <BarChart3 className="h-6 w-6 text-primary" />}
            <CardTitle>
              {step === 1 && "Project Setup"}
              {step === 2 && "R3tain Email Setup"}
              {step === 3 && "Onch3n Analytics"}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          {step === 1 && "Tell us about your project (30 seconds)"}
          {step === 2 &&
            "Configure your email automation for campaigns (45 seconds)"}
          {step === 3 &&
            "Set up analytics and webhooks for insights (30 seconds)"}
        </CardDescription>

        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Project Setup */}
        {step === 1 && (
          <ProjectSetupStep
            formData={formData}
            setFormData={setFormData}
            projectTypeOpen={projectTypeOpen}
            setProjectTypeOpen={setProjectTypeOpen}
            isValidContractAddress={isValidContractAddress}
            isWeb3Project={isWeb3Project}
          />
        )}

        {/* Step 2: R3tain Setup */}
        {step === 2 && (
          <EmailSetupStep formData={formData} setFormData={setFormData} />
        )}

        {/* Step 3: Onch3n Setup */}
        {step === 3 && (
          <AnalyticsSetupStep formData={formData} setFormData={setFormData} />
        )}

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

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            {step === 1 && "About 30 seconds remaining"}
            {step === 2 && "About 45 seconds remaining"}
            {step === 3 && "Almost done! 30 seconds"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
