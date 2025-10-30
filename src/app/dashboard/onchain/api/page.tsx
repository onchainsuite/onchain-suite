import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { APIPage } from "@/onchain/api/page";

const crumbs = [{ label: "API", href: PRIVATE_ROUTES.ONCHAIN.API }];

export default function API() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <APIPage />
    </DashboardLayout>
  );
}
