import { AudiencePages } from "@/features/audience/pages";
import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.AUDIENCE, label: "Audience" },
];

export default async function AudiencePage() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <AudiencePages />
    </DashboardLayout>
  );
}
