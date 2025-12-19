import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";
import { CreateAutomation } from "@/features/automation/components";

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
