import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";
import { ImportExportPage } from "@/features/audience/components";

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
