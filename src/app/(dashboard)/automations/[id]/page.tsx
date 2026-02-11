import { CreateAutomation } from "@/features/automation/components";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.NEW_AUTOMATION, label: "Create New Automation" },
];

export default function NewAutomationPage() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <CreateAutomation />
    </DashboardLayout>
  );
}
