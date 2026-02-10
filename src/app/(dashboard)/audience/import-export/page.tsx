import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

import { ImportExportPage } from "@/features/audience/components";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.AUDIENCE, label: "Audience" },
];

export default async function AudienceImportExportPage() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <ImportExportPage />
    </DashboardLayout>
  );
}
