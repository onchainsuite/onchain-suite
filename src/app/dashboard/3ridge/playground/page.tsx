import { PRIVATE_ROUTES } from "@/config/app-routes";

import { PlaygroundPage } from "@/3ridge/playground/page";
import { DashboardLayout } from "@/common/layout";

const crumbs = [
  { label: "Playground", href: PRIVATE_ROUTES.BRIDGE.PLAYGROUND.ROOT },
];

export default function Playground() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <PlaygroundPage />
    </DashboardLayout>
  );
}
