import { useRouter } from "next/navigation";
import { useState } from "react";

import { AUTH_ROUTES, PRIVATE_ROUTES } from "@/shared/config/app-routes";

export const useHandNavRouting = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { push } = useRouter();

  const handleRouting = (type: "login" | "signup" | "dashboard") => {
    let route: string;

    switch (type) {
      case "login":
        route = AUTH_ROUTES.LOGIN;
        break;
      case "signup":
        route = AUTH_ROUTES.REGISTER;
        break;
      case "dashboard":
        route = PRIVATE_ROUTES.DASHBOARD;
        break;
    }

    push(route);
    setIsMobileMenuOpen(false);
  };

  return { isMobileMenuOpen, setIsMobileMenuOpen, handleRouting };
};
