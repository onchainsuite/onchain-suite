"use server";

import { prisma } from "@/lib/prisma";

import {
  type OnboardingCompletionTime,
  type OnboardingStepData,
} from "@/types/onboarding";

import { getAuthenticatedUserId } from "@/auth/actions";
import { type JsonValue } from "@/prisma/internal/prismaNamespace";

// Constants
const DEFAULT_TOTAL_STEPS = 5;
// const RECENT_LOGS_LIMIT = 10;

/**
 * Helper to format time duration
 */
function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds} seconds`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`;
  return `${(seconds / 3600).toFixed(1)} hours`;
}

/**
 * Track a step in the onboarding process
 */
export async function trackOnboardingStep(
  stepData: OnboardingStepData
): Promise<string> {
  const userId = await getAuthenticatedUserId();

  // Use upsert to handle get-or-create in one operation
  const onboarding = await prisma.onboardingProgress.upsert({
    where: { userId },
    create: {
      userId,
      currentStep: stepData.stepName,
      totalSteps: DEFAULT_TOTAL_STEPS,
    },
    update: {}, // No update needed on existing record yet
  });

  const timeSpent = stepData.timeSpentSeconds ?? 0;
  const isCompleted = stepData.action === "completed";

  // Use a transaction to ensure atomicity
  const [stepLog] = await prisma.$transaction([
    // Create step log
    prisma.onboardingStepLog.create({
      data: {
        onboardingId: onboarding.id,
        stepName: stepData.stepName,
        action: stepData.action,
        timeSpentSeconds: timeSpent,
        stepData: (stepData.stepData as JsonValue) ?? {},
        userAgent: stepData.userAgent,
        ipAddress: stepData.ipAddress,
      },
    }),
    // Update onboarding progress
    prisma.onboardingProgress.update({
      where: { id: onboarding.id },
      data: isCompleted
        ? // Step completed - update all fields
          (() => {
            const newCompletedSteps = onboarding.completedSteps.includes(
              stepData.stepName
            )
              ? onboarding.completedSteps
              : [...onboarding.completedSteps, stepData.stepName];

            const completionPercentage =
              (newCompletedSteps.length / onboarding.totalSteps) * 100;
            const allStepsCompleted =
              newCompletedSteps.length >= onboarding.totalSteps;

            return {
              completedSteps: newCompletedSteps,
              completionPercentage,
              timeSpentSeconds: onboarding.timeSpentSeconds + timeSpent,
              lastActivityAt: new Date(),
              isCompleted: allStepsCompleted,
              completedAt: allStepsCompleted
                ? new Date()
                : onboarding.completedAt,
              currentStep: stepData.stepName,
            };
          })()
        : // Step not completed - update minimal fields
          {
            timeSpentSeconds: onboarding.timeSpentSeconds + timeSpent,
            lastActivityAt: new Date(),
            currentStep: stepData.stepName,
          },
    }),
  ]);

  return stepLog.id;
}

/**
 * Get user's onboarding completion time and progress
 */
export async function getUserOnboardingCompletionTime(): Promise<OnboardingCompletionTime | null> {
  const userId = await getAuthenticatedUserId();

  const onboarding = await prisma.onboardingProgress.findUnique({
    where: { userId },
    select: {
      id: true,
      timeSpentSeconds: true,
      completionPercentage: true,
      isCompleted: true,
      startedAt: true,
      completedAt: true,
      completedSteps: true,
      totalSteps: true,
    },
  });

  if (!onboarding) return null;

  return {
    onboardingId: onboarding.id,
    totalTimeSeconds: onboarding.timeSpentSeconds,
    totalTimeFormatted: formatTime(onboarding.timeSpentSeconds),
    completionPercentage: Number(onboarding.completionPercentage),
    isCompleted: onboarding.isCompleted,
    startedAt: onboarding.startedAt,
    completedAt: onboarding.completedAt,
    stepsCompleted: onboarding.completedSteps.length,
    totalSteps: onboarding.totalSteps,
  };
}

/**
 * Get onboarding progress for a user
 */
export async function getOnboardingProgress() {
  const userId = await getAuthenticatedUserId();

  return await prisma.onboardingProgress.findUnique({
    where: { userId },
  });
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding() {
  const userId = await getAuthenticatedUserId();

  const onboarding = await prisma.onboardingProgress.findUnique({
    where: { userId },
    select: { id: true, totalSteps: true },
  });

  if (!onboarding) {
    throw new Error("Onboarding progress not found");
  }

  return await prisma.onboardingProgress.update({
    where: { id: onboarding.id },
    data: {
      isCompleted: true,
      completedAt: new Date(),
      completionPercentage: 100,
      completedSteps: Array.from(
        { length: onboarding.totalSteps },
        (_, i) => `step_${i + 1}`
      ),
    },
  });
}

/**
 * Reset onboarding progress
 */
export async function resetOnboarding(userId: string) {
  // Verify authentication (admin action)
  await getAuthenticatedUserId();

  const onboarding = await prisma.onboardingProgress.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!onboarding) {
    throw new Error("Onboarding progress not found");
  }

  return await prisma.onboardingProgress.update({
    where: { id: onboarding.id },
    data: {
      currentStep: "welcome",
      completedSteps: [],
      completionPercentage: 0,
      isCompleted: false,
      completedAt: null,
      timeSpentSeconds: 0,
      sessionCount: 1,
      startedAt: new Date(),
    },
  });
}
