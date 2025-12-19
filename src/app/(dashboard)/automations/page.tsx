import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";

import { AutomationsPage } from "@/features/automation/pages";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.AUTOMATIONS, label: "Automation" },
];

export default function NewAutomationPage() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <AutomationsPage />
    </DashboardLayout>
  );
}
