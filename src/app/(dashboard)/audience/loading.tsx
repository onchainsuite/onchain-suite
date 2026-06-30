import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { DashboardSkeleton } from "@/shared/components/page/page-skeleton";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.AUDIENCE, label: "Audience" },
];

export default function Loading() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <DashboardSkeleton variant="table" withTabs={false} />
    </DashboardLayout>
  );
}
