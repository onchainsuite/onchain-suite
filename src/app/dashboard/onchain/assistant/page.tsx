import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { AssistantPage } from "@/onchain/assistant/page";

const crumbs = [
  { label: "AI Assistant", href: PRIVATE_ROUTES.ONCHAIN.ASSISTANT },
];

export default function Assistant() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <AssistantPage />
    </DashboardLayout>
  );
}
