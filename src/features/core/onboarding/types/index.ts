import { type Prisma } from "@/prisma/client";
import { type Decimal } from "@/prisma/internal/prismaNamespace";

export type OnboardingStep =
  | "welcome"
  | "personal_info"
  | "business_address"
  | "organization_type"
  | "business_goal"
  | "important_features"
  | "contact_count"
  | "plan_selection";

export interface OnboardingData {
  firstName: string;
  lastName: string;
  protocolName: string;
  phoneNumber?: string;
  marketingEmails: boolean;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  organizationTypes: string[];
  businessGoal: string;
  importantFeatures: string[];
  contactCount: string;
  selectedPlan: string;
}

export interface PersonalInfoStepProps {
  initialData: Partial<OnboardingData>;
  onNext: (data: Partial<OnboardingData>) => void | Promise<void>;
}

export interface OnboardingStepsProps extends PersonalInfoStepProps {
  onBack: () => void;
}

export interface IOnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
}

export interface OnboardingStepProps {
  onNext: () => void;
  onPrevious?: () => void;
  onComplete: (stepData?: Record<string, boolean>) => void;
  stepStartTime: number;
}

export interface OnboardingProgress {
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

export interface OnboardingProgressWithLogs {
  id: string;
  userId: string;
  currentStep: string;
  completedSteps: string[];
  totalSteps: number;
  completionPercentage: Decimal;
  isCompleted: boolean;
  startedAt: Date;
  completedAt: Date | null;
  lastActivityAt: Date;
  stepData: Prisma.JsonValue;
  timeSpentSeconds: number;
  sessionCount: number;
  abandonedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  onboardingStepLogs: Array<{
    id: string;
    onboardingId: string;
    stepName: string;
    action: string;
    timeSpentSeconds: number;
    stepData: Prisma.JsonValue;
    userAgent: string | null;
    ipAddress: string | null;
    createdAt: Date;
  }>;
}
