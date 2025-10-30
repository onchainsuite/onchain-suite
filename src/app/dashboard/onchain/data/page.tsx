import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { DataPage } from "@/onchain/data/pages";

const crumbs = [{ label: "Data", href: PRIVATE_ROUTES.ONCHAIN.DATA }];

export default function Data() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <DataPage />
    </DashboardLayout>
  );
}
