import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { SchemaPage } from "@/onchain/data/pages";

const crumbs = [
  { label: "Data", href: PRIVATE_ROUTES.ONCHAIN.DATA },
  { label: "Schema", href: PRIVATE_ROUTES.ONCHAIN.DATA_SCHEMA },
];

export default function Schema() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <SchemaPage />
    </DashboardLayout>
  );
}
