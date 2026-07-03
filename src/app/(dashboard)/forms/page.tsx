import { FormsPage } from "@/features/forms/pages";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.FORMS, label: "Forms" },
];

export default async function FormsRoutePage() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <FormsPage />
    </DashboardLayout>
  );
}
