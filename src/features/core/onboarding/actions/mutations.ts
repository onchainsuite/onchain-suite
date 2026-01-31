"use server";

import { revalidatePath } from "next/cache";

import { AUTH_ROUTES, PRIVATE_ROUTES } from "@/config/app-routes";
import { safeExecute } from "@/lib/safe-execute";
import { isJsonObject } from "@/lib/utils";

import type { SafeExecuteResponse } from "@/types/api";

import { getAuthenticatedUserId } from "@/auth/actions";
import { COMPLETION_PERCENTAGES, STEP_ORDER } from "@/onboarding/constants";
import {
  type Action,
  type OnboardingProgressWithLogs,
  type OnboardingStep,
} from "@/onboarding/types";

interface UpdateProgressParams {
  step: OnboardingStep;
  stepData?: Record<string, unknown>;
  action?: Action;
  timeSpentSeconds?: number;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Get the current onboarding progress for the authenticated user
 */
export async function getOnboardingProgress(): Promise<
  SafeExecuteResponse<{
    progress: OnboardingProgressWithLogs | null;
    isCompleted: boolean;
  }>
> {
  return safeExecute(async () => {
    const userId = await getAuthenticatedUserId();

    // TODO: Implement API call to get onboarding progress
    // Returning null to simulate "not started" or handle as needed
    return {
      progress: null,
      isCompleted: false,
    };
  });
}

/**
 * Update onboarding progress and save step data
 */
export async function updateOnboardingProgress(
  params: UpdateProgressParams
): Promise<SafeExecuteResponse<OnboardingProgressWithLogs>> {
  return safeExecute(async () => {
    const userId = await getAuthenticatedUserId();
    const {
      step,
      stepData = {},
      action = "completed",
      timeSpentSeconds = 0,
      userAgent,
      ipAddress,
    } = params;

    // TODO: Implement API call to update onboarding progress
    console.log("Updating onboarding progress (mock):", params);

    // Mock response
    const mockProgress: OnboardingProgressWithLogs = {
      id: "mock-id",
      userId,
      currentStep: step,
      completedSteps: [step],
      totalSteps: Object.keys(COMPLETION_PERCENTAGES).length,
      completionPercentage: COMPLETION_PERCENTAGES[step] || 0,
      isCompleted: false,
      startedAt: new Date(),
      completedAt: null,
      stepData: {},
      timeSpentSeconds: timeSpentSeconds,
      lastActivityAt: new Date(),
      sessionCount: 1,
      abandonedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      onboardingStepLogs: [],
    };

    revalidatePath(AUTH_ROUTES.ONBOARDING);

    return mockProgress;
  }, "Onboarding progress updated successfully");
}

/**
 * Complete the onboarding process
 */
export async function completeOnboarding(
  finalData?: Record<string, unknown>
): Promise<SafeExecuteResponse<OnboardingProgressWithLogs>> {
  return safeExecute(async () => {
    const userId = await getAuthenticatedUserId();

    // TODO: Implement API call to complete onboarding
    console.log("Completing onboarding (mock):", finalData);

    const mockProgress: OnboardingProgressWithLogs = {
      id: "mock-id",
      userId,
      currentStep: "plan_selection",
      completedSteps: ["plan_selection"],
      totalSteps: 5,
      completionPercentage: 100,
      isCompleted: true,
      startedAt: new Date(),
      completedAt: new Date(),
      stepData: finalData || {},
      timeSpentSeconds: 0,
      lastActivityAt: new Date(),
      sessionCount: 1,
      abandonedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      onboardingStepLogs: [],
    };

    revalidatePath(AUTH_ROUTES.ONBOARDING);
    revalidatePath(PRIVATE_ROUTES.DASHBOARD);

    return mockProgress;
  }, "Onboarding completed successfully");
}
