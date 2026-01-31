import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";
import CompanySettingsView from "@/features/settings/pages/company-settings-view";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";

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
