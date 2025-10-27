"use client";

import {
  HelpSection,
  HeroSection,
  PageHeader,
  PopularTemplates,
  RecommendedFlows,
  TestimonialSection,
} from "@/r3tain/automation/components";
import {
  helpResources,
  popularTemplates,
  recommendedFlows,
} from "@/r3tain/automation/data";

export function AutomationPage() {
  return (
    <>
      <PageHeader />
      <div className="mx-auto max-w-6xl flex-1 px-4">
        <HeroSection />
        <RecommendedFlows flows={recommendedFlows} />
        <PopularTemplates templates={popularTemplates} />
        <HelpSection resources={helpResources} />
        <TestimonialSection />
      </div>
    </>
  );
}
