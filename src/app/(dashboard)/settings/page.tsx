"use client";

import SettingsPage from "@/features/settings/pages/page";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.SETTINGS, label: "Settings" },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <SettingsPage />
    </DashboardLayout>
  );
}
