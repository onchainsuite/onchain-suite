"use client";
import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  UserIcon,
} from "@heroicons/react/24/outline";

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
import { Skeleton } from "@/components/ui/skeleton";

import { signOut, useSession } from "@/lib/auth-client";

export function UserMenu() {
  const { data } = useSession();
  const user = data?.user;

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.image ?? "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon aria-hidden="true" className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Cog6ToothIcon aria-hidden="true" className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={signOut}
          className="text-destructive focus:text-destructive"
        >
          <ArrowRightOnRectangleIcon
            aria-hidden="true"
            className="mr-2 h-4 w-4"
          />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="default" className="gap-2" onClick={onClick}>
      <Squares2X2Icon aria-hidden="true" className="h-4 w-4" />
      Dashboard
    </Button>
  );
}

export function NavbarButtonsSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-28" />
    </div>
  );
}
