import { Suspense } from "react";

import { AnimatedLoading } from "@/components/loading";

import { OnboardingFlow } from "@/onboarding/page";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  return (
    <Suspense fallback={<AnimatedLoading />}>
      <OnboardingFlow />
    </Suspense>
  );
}
