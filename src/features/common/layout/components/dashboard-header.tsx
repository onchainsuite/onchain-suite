/* eslint-disable no-console */
"use client";

import { Menu } from "lucide-react";
import * as React from "react";

import { ThemeModeToggle } from "@/components/common";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { ActionButtons, SearchBar, UserMenu } from "./header";

interface DashboardHeaderProps {
  isCollapsed: boolean;
  onMobileMenuToggle: () => void;
  onShowShortcuts?: () => void;
}

export function DashboardHeader({
  isCollapsed,
  onMobileMenuToggle,
  onShowShortcuts,
}: DashboardHeaderProps) {
  const [currentTeam, setCurrentTeam] = React.useState("OnchainSuite");
  const [teams] = React.useState([
    { id: "1", name: "OnchainSuite", accountId: "147154906" },
    { id: "2", name: "Acme Corp", accountId: "147154907" },
    { id: "3", name: "Tech Startup", accountId: "147154908" },
    { id: "4", name: "Digital Agency", accountId: "147154909" },
    { id: "5", name: "E-commerce Plus", accountId: "147154910" },
    { id: "6", name: "Marketing Pro", accountId: "147154911" },
    { id: "7", name: "Sales Force", accountId: "147154912" },
    { id: "8", name: "Customer Success", accountId: "147154913" },
    { id: "9", name: "Product Team", accountId: "147154914" },
    { id: "10", name: "Engineering Hub", accountId: "147154915" },
  ]);

  const handleTeamSwitch = React.useCallback((teamName: string) => {
    setCurrentTeam(teamName);
    console.log("[v0] Switched to team:", teamName);
  }, []);

  const handleCreateTeam = React.useCallback(() => {
    console.log("[v0] Create new team clicked");
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-border bg-linear-to-r from-sidebar via-sidebar-accent to-sidebar transition-all duration-300",
        isCollapsed ? "left-16" : "left-64",
        "max-lg:left-0"
      )}
    >
      <div className="flex h-full items-center gap-4 px-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-sidebar-foreground hover:bg-sidebar-foreground/10"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <SearchBar />

        {/* Actions - Hidden on mobile/tablet */}
        <div className="ml-auto flex">
          <ActionButtons onShowShortcuts={onShowShortcuts} />

          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <ThemeModeToggle />

            {/* User Menu */}
            <UserMenu
              currentTeam={currentTeam}
              teams={teams}
              onTeamSwitch={handleTeamSwitch}
              onCreateTeam={handleCreateTeam}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
