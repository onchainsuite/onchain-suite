import { Suspense } from "react";

import { AnimatedLoading } from "@/components/loading";

import { getUserOnboardingCompletionTime } from "@/onboarding/actions";
import { OnboardingFlow } from "@/onboarding/page";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const data = await getUserOnboardingCompletionTime();

  return (
    <Suspense fallback={<AnimatedLoading />}>
      <OnboardingFlow progress={data} />
    </Suspense>
  );
}
