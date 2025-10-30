import { PRIVATE_ROUTES } from "@/config/app-routes";

import { EventRulesPage } from "@/3ridge/event/pages";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  { label: "Event Rules", href: PRIVATE_ROUTES.BRIDGE.EVENTS.RULES },
];

export default function EventRules() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <EventRulesPage />
    </DashboardLayout>
  );
}
