"use client";
import { v7 } from "uuid";

import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
  NavItems,
} from "@/ui/resizable-navbar";
import { ThemeModeToggle } from "@/ui/theme-mode-toggle";

import { useSession } from "@/lib/auth-client";

import { navItems } from "../constants";
import { useHandNavRouting } from "../hooks";
import { DashboardButton, NavbarButtonsSkeleton, UserMenu } from "./user-menu";

export function OnchainNavbar() {
  const { isMobileMenuOpen, setIsMobileMenuOpen, handleRouting } =
    useHandNavRouting();
  const { data: session, isPending } = useSession();

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4 relative">
          <ThemeModeToggle />
          {isPending ? (
            <NavbarButtonsSkeleton />
          ) : session ? (
            <>
              <DashboardButton onClick={() => handleRouting("dashboard")} />
              <UserMenu />
            </>
          ) : (
            <>
              <NavbarButton
                variant="secondary"
                onClick={() => handleRouting("login")}
              >
                Login
              </NavbarButton>
              <NavbarButton
                variant="primary"
                onClick={() => handleRouting("signup")}
              >
                Get Started
              </NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <div className="flex gap-3 items-center">
            <ThemeModeToggle />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item) => (
            <a
              key={v7()}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-foreground"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}

          <div className="flex w-full flex-col gap-4">
            {isPending ? (
              <NavbarButtonsSkeleton />
            ) : session ? (
              <>
                <NavbarButton
                  onClick={() => handleRouting("dashboard")}
                  variant="primary"
                  className="w-full"
                >
                  Dashboard
                </NavbarButton>
                <UserMenu />
              </>
            ) : (
              <>
                <NavbarButton
                  onClick={() => handleRouting("login")}
                  variant="secondary"
                  className="w-full"
                >
                  Login
                </NavbarButton>
                <NavbarButton
                  onClick={() => handleRouting("signup")}
                  variant="primary"
                  className="w-full"
                >
                  Get Started
                </NavbarButton>
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
