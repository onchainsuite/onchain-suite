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

export interface OnboardingStep {
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
