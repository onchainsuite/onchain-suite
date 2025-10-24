"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TeamSwitcher } from "./team-switcher";

interface Team {
  id: string;
  name: string;
  accountId: string;
}

interface UserMenuProps {
  currentTeam: string;
  teams: Team[];
  onTeamSwitch: (teamName: string) => void;
  onCreateTeam: () => void;
}

export const UserMenu = React.memo(function UserMenu({
  currentTeam,
  teams,
  onCreateTeam,
}: UserMenuProps) {
  const currentTeamData = React.useMemo(
    () => teams.find((t) => t.name === currentTeam),
    [teams, currentTeam]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 gap-2 rounded-full pl-2 pr-3 text-sidebar-foreground hover:bg-sidebar-foreground/10"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              OS
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm">{currentTeam}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* User Info */}
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="User"
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                OS
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">OnchainSuite</span>
              <span className="text-xs text-muted-foreground">
                onchainsuite@gmail.com
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Team Switching Section */}
        <TeamSwitcher teams={teams} onCreateTeam={onCreateTeam} />
        <DropdownMenuSeparator />

        {/* Current Account Info */}
        <div className="px-2 py-1.5">
          <div className="text-xs font-semibold mb-1">Account</div>
          <div className="text-sm">{currentTeam}</div>
          <div className="text-xs text-muted-foreground">
            {currentTeamData?.accountId}
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* Account Setup Progress */}
        <div className="px-2 py-1.5">
          <div className="text-xs font-semibold mb-2">
            Finish your account setup
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs">18%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full w-[18%] bg-green-500 rounded-full" />
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem>Create a user</DropdownMenuItem>
        <DropdownMenuItem>Pricing & Features</DropdownMenuItem>
        <DropdownMenuItem>Account & Billing</DropdownMenuItem>
        <DropdownMenuItem>Product Updates</DropdownMenuItem>
        <DropdownMenuItem>HubSpot Academy</DropdownMenuItem>
        <DropdownMenuItem>Training & Services</DropdownMenuItem>
        <DropdownMenuSeparator />

        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuItem className="p-0">Sign out</DropdownMenuItem>
          <DropdownMenuItem className="p-0">Privacy policy</DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
