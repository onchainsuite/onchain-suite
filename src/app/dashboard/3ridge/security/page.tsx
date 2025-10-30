import { PRIVATE_ROUTES } from "@/config/app-routes";

import { SecurityPage } from "@/3ridge/security/page";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  { label: "Security", href: PRIVATE_ROUTES.BRIDGE.SECURITY.ROOT },
];

export default function Security() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <SecurityPage />
    </DashboardLayout>
  );
}
