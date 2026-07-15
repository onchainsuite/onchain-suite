"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { useGetLogo } from "@/hooks/client";
import { cn } from "@/lib/utils";

import type { NavItem } from "./dashboard-navbar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { PRIVATE_ROUTES } from "@/shared/config/app-routes";

/**
 * Mobile navigation for the dashboard shell (below lg, where the fixed
 * sidebar is hidden): a hamburger in the header opening a left sheet with
 * the same nav items, including the WIP fading treatment. Closes on
 * navigation.
 */
export function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { lightIcon, darkIcon, isCustom } = useGetLogo();

  // Close the sheet whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full lg:hidden"
          aria-label="Open navigation menu"
        >
          <Bars3Icon className="h-5 w-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle className="flex items-center justify-center gap-2 text-sm font-semibold">
            <Image
              src={lightIcon}
              width={22}
              height={22}
              alt=""
              aria-hidden="true"
              className="dark:hidden"
              unoptimized={isCustom}
            />
            <Image
              src={darkIcon}
              width={22}
              height={22}
              alt=""
              aria-hidden="true"
              className="hidden dark:block"
              unoptimized={isCustom}
            />
            Onchain Suite
          </SheetTitle>
        </SheetHeader>
        <nav className="mx-auto flex w-full max-w-[13.5rem] flex-col gap-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const active =
              item.href === PRIVATE_ROUTES.DASHBOARD
                ? pathname === PRIVATE_ROUTES.DASHBOARD
                : (pathname ?? "").startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm",
                  active
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  item.wip && "opacity-50"
                )}
              >
                <span className="h-4 w-4 shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.wip ? (
                  <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Soon
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
