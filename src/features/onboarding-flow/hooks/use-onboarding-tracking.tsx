"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";

type OnboardingStep =
  | "welcome"
  | "personal_info"
  | "business_address"
  | "organization_type"
  | "business_goal"
  | "important_features"
  | "contact_count"
  | "organization_setup"
  | "plan_selection";

interface OnboardingProgress {
  current_step: OnboardingStep;
  completion_percentage: number;
  step_data: Record<string, any>;
  is_completed: boolean;
}

interface UseOnboardingTracking {
  progress: OnboardingProgress | null;
  isLoading: boolean;
  updateProgress: (
    step: OnboardingStep,
    stepData: Record<string, any>,
    completionPercentage: number
  ) => Promise<void>;
  completeOnboarding: (finalData: Record<string, any>) => Promise<void>;
  resetProgress: () => Promise<void>;
}

const STEP_MAPPING: Record<number, OnboardingStep> = {
  1: "personal_info",
  2: "business_address",
  3: "organization_type",
  4: "business_goal",
  5: "important_features",
  6: "contact_count",
  7: "plan_selection",
};

const COMPLETION_PERCENTAGES: Record<OnboardingStep, number> = {
  welcome: 0,
  personal_info: 14,
  business_address: 28,
  organization_type: 42,
  business_goal: 57,
  important_features: 71,
  contact_count: 85,
  organization_setup: 50,
  plan_selection: 100,
};

export function useOnboardingTracking(): UseOnboardingTracking {
  const { data: session } = useSession();
  const user = session?.user;
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing progress on mount
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const loadProgress = async () => {
      try {
        const response = await fetch("/api/onboarding/progress");
        if (!response.ok) {
          throw new Error("Failed to load progress");
        }

        const data = await response.json();
        if (data.progress) {
          setProgress({
            current_step: data.progress.currentStep as OnboardingStep,
            completion_percentage: data.progress.completionPercentage,
            step_data: data.progress.stepData ?? {},
            is_completed: data.progress.isCompleted,
          });
        }
      } catch (error) {
        console.error("Error loading onboarding progress:", error);
        toast.error("Failed to load onboarding progress");
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user?.id]);

  const updateProgress = useCallback(
    async (
      step: OnboardingStep,
      stepData: Record<string, any>,
      completionPercentage: number
    ) => {
      if (!user?.id) {
        toast.error("User not authenticated");
        return;
      }

      try {
        const updatedStepData = { ...progress?.step_data, ...stepData };

        const response = await fetch("/api/onboarding/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            step,
            stepData: updatedStepData,
            completionPercentage,
            isCompleted: false,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update progress");
        }

        setProgress({
          current_step: step,
          completion_percentage: completionPercentage,
          step_data: updatedStepData,
          is_completed: false,
        });
      } catch (error) {
        console.error("Error updating onboarding progress:", error);
        toast.error("Failed to save progress");
      }
    },
    [user?.id, progress?.step_data]
  );

  const completeOnboarding = useCallback(
    async (finalData: Record<string, any>) => {
      if (!user?.id) {
        toast.error("User not authenticated");
        return;
      }

      try {
        const completeStepData = { ...progress?.step_data, ...finalData };

        const response = await fetch("/api/onboarding/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stepData: completeStepData,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to complete onboarding");
        }

        setProgress({
          current_step: "plan_selection",
          completion_percentage: 100,
          step_data: completeStepData,
          is_completed: true,
        });

        toast.success("Onboarding completed successfully!");
      } catch (error) {
        console.error("Error completing onboarding:", error);
        toast.error("Failed to complete onboarding");
      }
    },
    [user?.id, progress?.step_data]
  );

  const resetProgress = useCallback(async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch("/api/onboarding/reset", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to reset progress");
      }

      setProgress(null);
      toast.success("Onboarding progress reset");
    } catch (error) {
      console.error("Error resetting onboarding progress:", error);
      toast.error("Failed to reset progress");
    }
  }, [user?.id]);

  return {
    progress,
    isLoading,
    updateProgress,
    completeOnboarding,
    resetProgress,
  };
}

// Helper function to get step from number
export function getStepFromNumber(stepNumber: number): OnboardingStep {
  return STEP_MAPPING[stepNumber] || "welcome";
}

// Helper function to get completion percentage for step
export function getCompletionPercentage(step: OnboardingStep): number {
  return COMPLETION_PERCENTAGES[step] || 0;
}
