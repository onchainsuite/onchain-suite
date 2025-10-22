export interface OnboardingStepData {
  stepName: string;
  action: "started" | "completed" | "skipped" | "revisited";
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
