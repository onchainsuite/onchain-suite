import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { CreateSegmentPage } from "@/features/intelligence/components/segments/create";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.INTELLIGENCE_SEGMENTS, label: "Segments" },
];

export default async function CreateSegmentPages() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <CreateSegmentPage />
    </DashboardLayout>
  );
}
