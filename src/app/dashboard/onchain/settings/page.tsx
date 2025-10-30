import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { SettingsPage } from "@/onchain/settings/page";

const crumbs = [{ label: "Settings", href: PRIVATE_ROUTES.ONCHAIN.SETTINGS }];

export default function Settings() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <SettingsPage />
    </DashboardLayout>
  );
}
