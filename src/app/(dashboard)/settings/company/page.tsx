import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import CompanySettingsView from "@/features/settings/pages/company-settings-view";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.SETTINGS, label: "Settings" },
  { href: "/settings/company", label: "Company" },
];

export default function CompanySettingsPage() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <CompanySettingsView />
    </DashboardLayout>
  );
}
