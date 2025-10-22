"use client";

import { ChevronDown, Globe, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/common";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

import { publicRoutes } from "@/config/app-routes";
import { useLocalStorage } from "@/hooks/client";
import { getInitials } from "@/lib/utils";

import { type SignUpFormData } from "@/auth/validation";

export function LayoutHeader() {
  const { value: user } = useLocalStorage<SignUpFormData | null>("user", null);
  const userEmail = user?.email ?? "";
  const userInitials = getInitials(user?.firstName, user?.lastName);
  const { push } = useRouter();

  return (
    <header className="border-border bg-card border-b px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo onClick={() => push(publicRoutes.home)} />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 px-2 sm:gap-2 sm:px-3"
              >
                <Globe className="h-4 w-4" />
                <span className="xs:inline hidden">EN</span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
              <DropdownMenuItem>Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 px-2 sm:gap-2 sm:px-3"
              >
                {/* Mobile: Show avatar only */}
                <div className="sm:hidden">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Desktop: Show full email */}
                <span className="hidden text-sm lg:inline">{userEmail}</span>

                {/* Tablet: Show truncated email */}
                <span className="hidden text-sm sm:inline lg:hidden">
                  {userEmail.length > 20
                    ? `${userEmail.substring(0, 20)}...`
                    : userEmail}
                </span>

                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="text-muted-foreground border-b px-2 py-1.5 text-sm sm:hidden">
                {userEmail}
              </div>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
