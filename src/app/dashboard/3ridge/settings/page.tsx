import { PRIVATE_ROUTES } from "@/config/app-routes";

import { SettingsPage } from "@/3ridge/settings/page";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  { label: "Settings", href: PRIVATE_ROUTES.BRIDGE.SETTINGS.ROOT },
];

export default function Settings() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <SettingsPage />
    </DashboardLayout>
  );
}
