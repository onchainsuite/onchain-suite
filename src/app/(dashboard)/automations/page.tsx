import { AutomationsPage } from "@/features/automation/pages";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.AUTOMATIONS, label: "Automations" },
];

export default function NewAutomationPage() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <AutomationsPage />
    </DashboardLayout>
  );
}
