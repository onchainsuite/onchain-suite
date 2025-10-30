import { PRIVATE_ROUTES } from "@/config/app-routes";

import { EventHistoryPage } from "@/3ridge/event/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  { label: "Event History", href: PRIVATE_ROUTES.BRIDGE.EVENTS.HISTORY },
];

export default function EventHistory() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <EventHistoryPage />
    </DashboardLayout>
  );
}
