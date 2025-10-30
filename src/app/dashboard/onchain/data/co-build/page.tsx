import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { CoBuildPage } from "@/onchain/data/pages";

const crumbs = [
  { label: "Data", href: PRIVATE_ROUTES.ONCHAIN.DATA },
  { label: "Co-Build", href: PRIVATE_ROUTES.ONCHAIN.DATA_CO_BUILD },
];

export default function CoBuild() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <CoBuildPage />
    </DashboardLayout>
  );
}
