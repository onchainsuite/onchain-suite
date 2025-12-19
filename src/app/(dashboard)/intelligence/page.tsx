"use client";

import IntelligencePage from "@/features/intelligence/components/intelligence.page";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.INTELLIGENCE, label: "Intelligence" },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <IntelligencePage />
    </DashboardLayout>
  );
}
