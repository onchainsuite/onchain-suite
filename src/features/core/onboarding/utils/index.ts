import { COMPLETION_PERCENTAGES, STEP_ORDER } from "@/onboarding/constants";
import { type OnboardingStep } from "@/onboarding/types";

// Helper function to get step from number
export function getStepFromNumber(stepNumber: number): OnboardingStep {
  return STEP_ORDER[stepNumber] ?? "welcome";
}

// Helper function to get completion percentage for step
export function getCompletionPercentage(step: OnboardingStep): number {
  return COMPLETION_PERCENTAGES[step] ?? 0;
}
