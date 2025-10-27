"use client";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { AudienceSection } from "./audience-section";
import { AutomationsSection } from "./automations-section";
import { EmailPerformance } from "./email-performance";
import { EmailTaggedContacts } from "./email-tagged-contacts";
import { DashboardLayout } from "@/common/layout";

const crumbs = [{ label: "Overview", href: PRIVATE_ROUTES.ROOT }];

export function ReturningUserDashboard() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <div className="mx-auto max-w-7xl space-y-8 p-4">
        <EmailPerformance />

        {/* Audience Section */}
        <AudienceSection />

        {/* Automations Section - Full Width */}
        <AutomationsSection />

        {/* Email Tagged Contacts */}
        <EmailTaggedContacts />
      </div>
    </DashboardLayout>
  );
}
