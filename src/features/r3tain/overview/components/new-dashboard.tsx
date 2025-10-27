"use client";

import { type User } from "better-auth";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { FeatureCards } from "./feature-cards";
import { GetStartedSection } from "./get-started-section";
import { OnboardingCalendar } from "./new-calendar";
import { PlanUsageCard } from "./plan-usage-card";
import { WelcomeSection } from "./welcome-section";
import { DashboardLayout } from "@/common/layout";

const crumbs = [{ label: "Welcome", href: PRIVATE_ROUTES.ROOT }];

export function NewUserDashboard({ user }: { user: User }) {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      {/* <NewUserBanner /> */}
      <div className="mx-auto max-w-6xl space-y-8 p-4">
        {/* Welcome Section with Calendar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <WelcomeSection userName={user.name} />
          </div>
          <div className="lg:col-span-1">
            <OnboardingCalendar />
          </div>
        </div>

        {/* Get Started Section */}
        <div className="mt-8 lg:mt-10">
          <GetStartedSection />
        </div>

        {/* Plan Usage */}
        <div className="mt-8 lg:mt-10">
          <PlanUsageCard />
        </div>

        {/* Feature Cards Section */}
        <div className="mt-8 lg:mt-10">
          <FeatureCards />
        </div>
      </div>
    </DashboardLayout>
  );
}
