import { PRIVATE_ROUTES } from "@/config/app-routes";

import { SimulatorPage } from "@/3ridge/routes/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  // { label: "Routes", href: PRIVATE_ROUTES.BRIDGE.ROUTES.ROOT },
  { label: "Simulator", href: PRIVATE_ROUTES.BRIDGE.ROUTES.SIMULATOR },
];

export default function Simulator() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <SimulatorPage />
    </DashboardLayout>
  );
}
