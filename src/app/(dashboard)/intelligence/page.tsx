import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import IntelligencePage from "@/features/intelligence/components/intelligence.page";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.INTELLIGENCE, label: "Intelligence" },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <IntelligencePage />
    </DashboardLayout>
  );
}
