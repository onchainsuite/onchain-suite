import { type ReactNode } from "react";

import { GuestGuard } from "@/lib/guard";

import { SiteFooter } from "@/shared/components/page/site-footer";

const GuestLayout = ({ children }: { children: ReactNode }) => {
  return (
    <GuestGuard>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </GuestGuard>
  );
};

export default GuestLayout;
