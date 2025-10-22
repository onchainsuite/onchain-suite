import { Suspense } from "react";

import { AnimatedLoading } from "@/components/loading";

import { OnboardingFlow } from "@/onboarding/page";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<AnimatedLoading />}>
      <OnboardingFlow />
    </Suspense>
  );
}
