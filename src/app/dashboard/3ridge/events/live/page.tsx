import { PRIVATE_ROUTES } from "@/config/app-routes";

import { LiveEventsPage } from "@/3ridge/event/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  { label: "Live Events", href: PRIVATE_ROUTES.BRIDGE.EVENTS.LIVE },
];

export default function LiveEvents() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <LiveEventsPage />
    </DashboardLayout>
  );
}
