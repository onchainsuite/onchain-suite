"use client";

import { useRouter } from "next/navigation";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import {
  ActionCards,
  AdditionalResources,
  FeatureCards,
  HeroSection,
  PageTitle,
} from "@/r3tain/community/components/dashboard";

export const NewUserDashboardPage = () => {
  const { push } = useRouter();
  return (
    <main className="min-w-0 flex-1">
      <PageTitle />

      <div className="space-y-6 pb-8 lg:space-y-8">
        <div className="pt-6 lg:pt-8">
          <HeroSection
            onGetStarted={() => push(PRIVATE_ROUTES.R3TAIN.ADD_SUBSCRIBERS)}
          />
        </div>

        <div className="px-4 lg:px-8">
          <FeatureCards />
        </div>

        <div className="px-0 lg:px-8">
          <ActionCards />
        </div>

        <div className="px-4 lg:px-8">
          <AdditionalResources />
        </div>
      </div>
    </main>
  );
};
