import { type ReactNode } from "react";

import { GuestGuard } from "@/guard/guest.guard";

const GuestLayout = ({ children }: { children: ReactNode }) => {
  return <GuestGuard>{children}</GuestGuard>;
};

export default GuestLayout;
