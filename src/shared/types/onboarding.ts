export type Action = "started" | "completed" | "skipped" | "revisited";

export interface OnboardingStepData {
  stepName: string;
  action: Action;
  timeSpentSeconds?: number;
  stepData?: Record<string, unknown>;
  userAgent?: string;
  ipAddress?: string;
}

export interface OnboardingCompletionTime {
  onboardingId: string;
  totalTimeSeconds: number;
  totalTimeFormatted: string;
  completionPercentage: number;
  isCompleted: boolean;
  startedAt: Date;
  completedAt: Date | null;
  stepsCompleted: number;
  totalSteps: number;
}
