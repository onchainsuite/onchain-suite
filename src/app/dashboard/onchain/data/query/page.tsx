import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { QueryPage } from "@/onchain/data/pages";

const crumbs = [
  { label: "Data", href: PRIVATE_ROUTES.ONCHAIN.DATA },
  { label: "Query", href: PRIVATE_ROUTES.ONCHAIN.DATA_QUERY },
];

export default function Query() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <QueryPage />
    </DashboardLayout>
  );
}
