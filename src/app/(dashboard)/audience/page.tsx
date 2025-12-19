import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";
import  { AudiencePages }  from "@/features/audience/pages";

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
