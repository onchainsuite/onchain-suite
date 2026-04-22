"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { apiClient } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { isJsonObject } from "@/lib/utils";

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
  step_data: Record<string, unknown>;
  is_completed: boolean;
}

interface UseOnboardingTracking {
  progress: OnboardingProgress | null;
  isLoading: boolean;
  trackStep: (payload: {
    stepName: OnboardingStep;
    action: "started" | "completed" | "skipped";
    timeSpentSeconds?: number;
    currentStep?: OnboardingStep;
    stepData?: Record<string, unknown>;
    flowVersion?: string;
    metadata?: Record<string, unknown>;
  }) => Promise<void>;
  completeOnboarding: (payload: {
    totalTimeSeconds?: number;
    currentStep?: OnboardingStep;
    stepData?: Record<string, unknown>;
    flowVersion?: string;
  }) => Promise<void>;
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
        const res = await apiClient.get("/onboarding/progress");
        const payload: unknown = res.data;
        const data =
          isJsonObject(payload) && "data" in payload ? payload.data : payload;
        const dataObj = isJsonObject(data) ? data : undefined;
        const nestedData = isJsonObject(dataObj?.data)
          ? dataObj.data
          : undefined;
        const pCandidate =
          dataObj?.progress ??
          nestedData?.progress ??
          dataObj?.progressData ??
          dataObj ??
          data;
        const p = isJsonObject(pCandidate) ? pCandidate : undefined;

        if (
          p &&
          ("currentStep" in p ||
            "current_step" in p ||
            "isCompleted" in p ||
            "is_completed" in p)
        ) {
          const stepCandidate =
            p.current_step ?? p.currentStep ?? p.current_step_name ?? "welcome";
          setProgress({
            current_step:
              typeof stepCandidate === "string"
                ? (stepCandidate as OnboardingStep)
                : "welcome",
            completion_percentage:
              typeof p.completion_percentage === "number"
                ? p.completion_percentage
                : typeof p.completionPercentage === "number"
                  ? p.completionPercentage
                  : 0,
            step_data: isJsonObject(p.step_data)
              ? p.step_data
              : isJsonObject(p.stepData)
                ? p.stepData
                : {},
            is_completed:
              typeof p.is_completed === "boolean"
                ? p.is_completed
                : typeof p.isCompleted === "boolean"
                  ? p.isCompleted
                  : false,
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

  const trackStep = useCallback(
    async (payload: {
      stepName: OnboardingStep;
      action: "started" | "completed" | "skipped";
      timeSpentSeconds?: number;
      currentStep?: OnboardingStep;
      stepData?: Record<string, unknown>;
      flowVersion?: string;
      metadata?: Record<string, unknown>;
    }) => {
      if (!user?.id) {
        toast.error("User not authenticated");
        return;
      }

      try {
        const updatedStepData = payload.stepData ?? {};

        await apiClient.post("/onboarding/track", {
          stepName: payload.stepName,
          action: payload.action,
          timeSpentSeconds: payload.timeSpentSeconds,
          currentStep: payload.currentStep,
          stepData: updatedStepData,
          flowVersion: payload.flowVersion ?? "frontend-v1",
          metadata: payload.metadata,
        });

        const completionFromMeta =
          isJsonObject(payload.metadata) &&
          typeof payload.metadata.completionPercentage === "number"
            ? payload.metadata.completionPercentage
            : undefined;
        const completionPercentage =
          completionFromMeta ?? COMPLETION_PERCENTAGES[payload.stepName] ?? 0;

        setProgress((prev) => ({
          current_step: payload.currentStep ?? payload.stepName,
          completion_percentage: completionPercentage,
          step_data: {
            ...(prev?.step_data ?? {}),
            ...updatedStepData,
          },
          is_completed: false,
        }));
      } catch (error) {
        console.error("Error tracking onboarding step:", error);
        toast.error("Failed to save progress");
      }
    },
    [user?.id]
  );

  const completeOnboarding = useCallback(
    async (payload: {
      totalTimeSeconds?: number;
      currentStep?: OnboardingStep;
      stepData?: Record<string, unknown>;
      flowVersion?: string;
    }) => {
      if (!user?.id) {
        toast.error("User not authenticated");
        return;
      }

      try {
        const completeStepData = payload.stepData ?? {};

        await apiClient.post("/onboarding/complete", {
          totalTimeSeconds: payload.totalTimeSeconds,
          currentStep: payload.currentStep,
          stepData: completeStepData,
          flowVersion: payload.flowVersion ?? "frontend-v1",
        });

        setProgress((prev) => ({
          current_step: (payload.currentStep ??
            "plan_selection") as OnboardingStep,
          completion_percentage: 100,
          step_data: {
            ...(prev?.step_data ?? {}),
            ...completeStepData,
          },
          is_completed: true,
        }));

        toast.success("Onboarding completed successfully!");
      } catch (error) {
        console.error("Error completing onboarding:", error);
        toast.error("Failed to complete onboarding");
      }
    },
    [user?.id]
  );

  return {
    progress,
    isLoading,
    trackStep,
    completeOnboarding,
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

export async function fetchOnboardingAdminSummary(params?: {
  from?: string;
  to?: string;
}) {
  const res = await apiClient.get("/onboarding/admin/summary", { params });
  const payload: unknown = res.data;
  return isJsonObject(payload) && "data" in payload ? payload.data : payload;
}
