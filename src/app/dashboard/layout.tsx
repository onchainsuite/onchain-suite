import { type ReactNode } from "react";

import { ProtectedLayout } from "@/lib/guard";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <ProtectedLayout>{children}</ProtectedLayout>;
};

export default DashboardLayout;
