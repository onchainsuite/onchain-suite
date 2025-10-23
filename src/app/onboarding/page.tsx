import { Suspense } from "react";

import { AnimatedLoading } from "@/components/loading";

import { OnboardingFlow } from "@/onboarding/page";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  // const data = await getUserOnboardingCompletionTime();

  return (
    <Suspense fallback={<AnimatedLoading />}>
      <OnboardingFlow progress={null} />
    </Suspense>
  );
}
