import { PRIVATE_ROUTES } from "@/config/app-routes";

import { WebhooksPage } from "@/3ridge/routes/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  // { label: "Routes", href: PRIVATE_ROUTES.BRIDGE.ROUTES.ROOT },
  { label: "Webhooks", href: PRIVATE_ROUTES.BRIDGE.ROUTES.WEBHOOKS },
];

export default function Webhook() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <WebhooksPage />
    </DashboardLayout>
  );
}
