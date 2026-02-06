export interface OnboardingData {
  // Organization Setup
  organizationName: string;
  websiteUrl: string;
  logoUrl?: string;
  description?: string;

  // Legacy/Optional
  firstName?: string;
  lastName?: string;
  protocolName?: string;
  phoneNumber?: string;
  marketingEmails?: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  organizationTypes?: string[];
  businessGoal?: string;
  importantFeatures?: string[];
  contactCount?: string;
  selectedPlan?: string;
}

export interface PersonalInfoStepProps {
  initialData: Partial<OnboardingData>;
  onNext: (data: Partial<OnboardingData>) => void | Promise<void>;
}

export interface OnboardingStepsProps extends PersonalInfoStepProps {
  onBack: () => void;
}
