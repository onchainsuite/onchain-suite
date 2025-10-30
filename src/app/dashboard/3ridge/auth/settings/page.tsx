import { PRIVATE_ROUTES } from "@/config/app-routes";

import { AuthSettingsPage } from "@/3ridge/3ridge-auth/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  { label: "Biometrics", href: PRIVATE_ROUTES.BRIDGE.AUTH.SETTINGS },
];

export default function AuthSettings() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <AuthSettingsPage />
    </DashboardLayout>
  );
}
