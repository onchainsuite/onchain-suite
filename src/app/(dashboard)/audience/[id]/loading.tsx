import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { DashboardSkeleton } from "@/shared/components/page/page-skeleton";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.AUDIENCE, label: "Audience" },
  { href: "", label: "Profile" },
];

export default function ProfileLoading() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <DashboardSkeleton variant="cards" withTabs withStats />
    </DashboardLayout>
  );
}
