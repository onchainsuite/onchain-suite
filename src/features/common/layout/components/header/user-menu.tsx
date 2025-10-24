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

import { signOut, useSession } from "@/lib/auth-client";
import { getInitials } from "@/lib/user-utils";

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
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 gap-2 rounded-full pl-2 pr-3 text-sidebar-foreground hover:bg-sidebar-foreground/10"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={session?.user.image ?? ""}
              alt={session?.user.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getInitials(session?.user.name ?? "")}
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
                src={session?.user.image ?? ""}
                alt={session?.user.name}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(session?.user.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{session?.user.name}</span>
              <span className="text-xs text-muted-foreground">
                {session?.user.email}
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
        <DropdownMenuSeparator />

        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
          <DropdownMenuItem>Privacy policy</DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
