"use server";

import { revalidatePath } from "next/cache";

import { AUTH_ROUTES, PRIVATE_ROUTES } from "@/config/app-routes";
import { prisma } from "@/lib/prisma";
import { safeExecute } from "@/lib/safe-execute";
import { transformPrisma } from "@/lib/transform-prisma";
import { isJsonObject } from "@/lib/utils";

import type { SafeExecuteResponse } from "@/types/api";

import { getAuthenticatedUserId } from "@/auth/actions";
import { COMPLETION_PERCENTAGES, STEP_ORDER } from "@/onboarding/constants";
import {
  type Action,
  type OnboardingProgressWithLogs,
  type OnboardingStep,
} from "@/onboarding/types";
import { type Prisma } from "@/prisma/client";
import { Decimal } from "@/prisma/internal/prismaNamespace";

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

    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId },
      include: {
        onboardingStepLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    return {
      progress: transformPrisma(progress),
      isCompleted: progress?.isCompleted ?? false,
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

    // Get or create onboarding progress
    let progress = await prisma.onboardingProgress.findUnique({
      where: { userId },
    });

    progress ??= await prisma.onboardingProgress.create({
      data: {
        userId,
        currentStep: step,
        completedSteps: [],
        stepData: {},
      },
    });

    const currentStepData = isJsonObject(progress.stepData)
      ? progress.stepData
      : {};
    const currentCompletedSteps = progress.completedSteps || [];

    // Get existing step data for this specific step
    const existingStepData = isJsonObject(currentStepData[step])
      ? currentStepData[step]
      : {};

    // Merge new step data with existing data
    const updatedStepData: Record<string, unknown> = {
      ...currentStepData,
      [step]: {
        ...existingStepData,
        ...stepData,
        lastUpdated: new Date().toISOString(),
        action,
      },
    };

    // Update completed steps array
    const updatedCompletedSteps = [...currentCompletedSteps];
    if (
      (action === "completed" || action === "skipped") &&
      !currentCompletedSteps.includes(step)
    ) {
      updatedCompletedSteps.push(step);
    }

    // Calculate next step
    const currentStepIndex = STEP_ORDER.indexOf(step);
    const nextStep =
      currentStepIndex < STEP_ORDER.length - 1
        ? STEP_ORDER[currentStepIndex + 1]
        : step;

    // Calculate completion percentage based on completed steps
    const completionPercentage = COMPLETION_PERCENTAGES[step];

    // Update progress
    const updatedProgress = await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        currentStep:
          action === "completed" || action === "skipped" ? nextStep : step,
        completedSteps: updatedCompletedSteps,
        completionPercentage: new Decimal(completionPercentage),
        stepData: updatedStepData as Prisma.InputJsonValue,
        lastActivityAt: new Date(),
        timeSpentSeconds: progress.timeSpentSeconds + timeSpentSeconds,
        abandonedAt: null, // Reset abandoned status on activity
      },
      include: {
        onboardingStepLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    // Log the step activity
    await prisma.onboardingStepLog.create({
      data: {
        onboardingId: updatedProgress.id,
        stepName: step,
        action,
        timeSpentSeconds,
        stepData: stepData as Prisma.InputJsonValue,
        userAgent,
        ipAddress,
      },
    });

    revalidatePath(AUTH_ROUTES.ONBOARDING);

    return updatedProgress;
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

    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      throw new Error("Onboarding progress not found");
    }

    const currentStepData = isJsonObject(progress.stepData)
      ? progress.stepData
      : {};

    const updatedStepData: Record<string, unknown> = finalData
      ? { ...currentStepData, final: finalData }
      : currentStepData;

    const updatedProgress = await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        currentStep: "plan_selection",
        completionPercentage: new Decimal(100),
        stepData: updatedStepData as Prisma.InputJsonValue,
        lastActivityAt: new Date(),
      },
      include: {
        onboardingStepLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    // Log completion
    await prisma.onboardingStepLog.create({
      data: {
        onboardingId: updatedProgress.id,
        stepName: "plan_selection",
        action: "completed",
        timeSpentSeconds: 0,
        stepData: (finalData ?? {}) as Prisma.InputJsonValue,
      },
    });

    revalidatePath(AUTH_ROUTES.ONBOARDING);
    revalidatePath(PRIVATE_ROUTES.DASHBOARD);

    return updatedProgress;
  }, "Onboarding completed successfully");
}

/**
 * Skip a specific step
 */
export async function skipOnboardingStep(
  step: OnboardingStep,
  timeSpentSeconds: number = 0
): Promise<SafeExecuteResponse<OnboardingProgressWithLogs>> {
  return updateOnboardingProgress({
    step,
    stepData: { skipped: true },
    action: "skipped",
    timeSpentSeconds,
  });
}

/**
 * Reset onboarding progress (useful for testing or if user wants to restart)
 */
export async function resetOnboarding(): Promise<SafeExecuteResponse<void>> {
  return safeExecute(async () => {
    const userId = await getAuthenticatedUserId();

    await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        currentStep: "welcome",
        completedSteps: [],
        completionPercentage: new Decimal(0),
        isCompleted: false,
        stepData: {},
        completedAt: null,
        lastActivityAt: new Date(),
        timeSpentSeconds: 0,
      },
    });

    revalidatePath(AUTH_ROUTES.ONBOARDING);
  }, "Onboarding reset successfully");
}

/**
 * Mark onboarding as abandoned
 */
export async function markOnboardingAbandoned(): Promise<
  SafeExecuteResponse<void>
> {
  return safeExecute(async () => {
    const userId = await getAuthenticatedUserId();

    await prisma.onboardingProgress.update({
      where: { userId },
      data: {
        abandonedAt: new Date(),
      },
    });
  }, "Onboarding marked as abandoned");
}

/**
 * Save partial step data without completing the step
 * Useful for autosave functionality
 */
export async function saveStepDraft(
  step: OnboardingStep,
  stepData: Record<string, unknown>
): Promise<SafeExecuteResponse<OnboardingProgressWithLogs>> {
  return updateOnboardingProgress({
    step,
    stepData,
    action: "started",
    timeSpentSeconds: 0,
  });
}
