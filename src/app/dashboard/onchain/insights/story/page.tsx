import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { StoryPage } from "@/onchain/insights/pages";

const crumbs = [
  { label: "Insights", href: PRIVATE_ROUTES.ONCHAIN.INSIGHTS },
  { label: "Story", href: PRIVATE_ROUTES.ONCHAIN.INSIGHTS_STORY },
];

export default function Story() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <StoryPage />
    </DashboardLayout>
  );
}
