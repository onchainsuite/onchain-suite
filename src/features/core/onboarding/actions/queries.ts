"use server";

import { getAuthenticatedUserId } from "@/auth/actions";
import { type OnboardingStepData } from "@/onboarding/types";

// Constants
const DEFAULT_TOTAL_STEPS = 5;

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

  // TODO: Implement API call to track onboarding step
  console.log("Tracking onboarding step (mock):", stepData);

  return "mock-log-id";
}
