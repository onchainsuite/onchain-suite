import { PRIVATE_ROUTES } from "@/config/app-routes";

import { DashboardLayout } from "@/common/layout";
import { AddSubscriber } from "@/r3tain/community/pages";

const crumbs = [
  { label: "Community", href: PRIVATE_ROUTES.R3TAIN.COMMUNITY },
  { label: "Subscribers", href: PRIVATE_ROUTES.R3TAIN.SUBSCRIBERS },
  { label: "Add Subscriber", href: PRIVATE_ROUTES.R3TAIN.ADD_SUBSCRIBERS },
];

export default function Page() {
  return (
    <DashboardLayout breadcrumbs={crumbs}>
      <AddSubscriber />
    </DashboardLayout>
  );
}
