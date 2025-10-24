import { useRouter } from "next/navigation";
import { useState } from "react";

import { authRoutes, privateRoutes } from "@/config/app-routes";

export const useHandNavRouting = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { push } = useRouter();

  const handleRouting = (type: "login" | "signup" | "dashboard") => {
    let route: string;

    switch (type) {
      case "login":
        route = authRoutes.login;
        break;
      case "signup":
        route = authRoutes.register;
        break;
      case "dashboard":
        route = privateRoutes.home;
        break;
    }

    push(route);
    setIsMobileMenuOpen(false);
  };

  return { isMobileMenuOpen, setIsMobileMenuOpen, handleRouting };
};
