import { Suspense } from "react";

import { AnimatedLoading } from "@/components/loading";

import { getOnboardingProgress } from "@/onboarding/actions";
import { OnboardingFlow } from "@/onboarding/page";

export default async function OnboardingPage() {
  const data = await getOnboardingProgress();

  return (
    <Suspense fallback={<AnimatedLoading />}>
      <OnboardingFlow progress={data} />
    </Suspense>
  );
}
