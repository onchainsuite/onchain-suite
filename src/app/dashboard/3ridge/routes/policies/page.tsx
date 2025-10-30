import { PRIVATE_ROUTES } from "@/config/app-routes";

import { PoliciesPage } from "@/3ridge/routes/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  // { label: "Routes", href: PRIVATE_ROUTES.BRIDGE.ROUTES.ROOT },
  { label: "Polices", href: PRIVATE_ROUTES.BRIDGE.ROUTES.POLICIES },
];

export default function Polices() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <PoliciesPage />
    </DashboardLayout>
  );
}
