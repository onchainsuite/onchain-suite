import { type ReactNode } from "react";

import { ProtectedLayout } from "@/lib/guard";

export const dynamic = "force-dynamic";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <ProtectedLayout>{children}</ProtectedLayout>;
};

export default DashboardLayout;
