import { PRIVATE_ROUTES, publicRoutes } from "@/config/app-routes";

import { DashboardLayout } from "@/features/common/layout/components/dashboard-layout";
import { InboxPages } from "@/features/inbox/pages";

export const dynamic = "force-dynamic";

const breadcrumbs = [
  { href: publicRoutes.HOME, label: "Home" },
  { href: PRIVATE_ROUTES.INBOX, label: "Inbox" },
];

export default async function InboxPage() {
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <InboxPages />
    </DashboardLayout>
  );
}
