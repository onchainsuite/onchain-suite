"use server";

import { getAuthenticatedUserId } from "@/auth/actions";
import { type OnboardingStepData } from "@/onboarding/types";

/**
 * Track a step in the onboarding process
 */
export async function trackOnboardingStep(
  stepData: OnboardingStepData
): Promise<string> {
  const _userId = await getAuthenticatedUserId();

  // TODO: Implement API call to track onboarding step
  String(stepData);

  return "mock-log-id";
}
