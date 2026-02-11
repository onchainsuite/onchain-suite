"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  logoUrl?: string; // Handle both cases just in case
}

export function OrganizationSwitcher() {
  const { data: session } = authClient.useSession();
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [activeOrgId, setActiveOrgId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (session?.session?.activeOrganizationId) {
      setActiveOrgId(session.session.activeOrganizationId);
    }
  }, [session?.session?.activeOrganizationId]);

  React.useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await authClient.organization.list();
        if (res.data) {
          setOrganizations(res.data as Organization[]);
        }
      } catch (error) {
        console.error("Failed to fetch organizations", error);
      }
    };

    if (session) {
      fetchOrganizations();
    }
  }, [session]);

  const activeOrg = organizations.find((org) => org.id === activeOrgId);

  const handleSwitchOrg = async (orgId: string) => {
    if (orgId === activeOrgId) return;

    setIsLoading(true);
    try {
      await authClient.organization.setActive({ organizationId: orgId });
      setActiveOrgId(orgId);
      toast.success("Switched organization");
      window.location.reload(); // Reload to refresh data context
    } catch (err) {
      console.error("Failed to switch organization", err);
      toast.error("Failed to switch organization");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted || !session) {
    return (
      <Button
        variant="outline"
        role="combobox"
        aria-label="Loading organization"
        className="w-[200px] justify-between"
        disabled
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Skeleton className="h-5 w-5 rounded-full shrink-0" />
          <Skeleton className="h-4 w-20" />
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Select organization"
          className="w-[200px] justify-between"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="h-5 w-5 shrink-0">
              <AvatarImage
                src={activeOrg?.logo || activeOrg?.logoUrl}
                alt={activeOrg?.name ?? "Org"}
              />
              <AvatarFallback>
                {activeOrg?.name?.substring(0, 2).toUpperCase() ?? "OR"}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">
              {activeOrg?.name ?? "Select Organization"}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuGroup>
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onSelect={() => handleSwitchOrg(org.id)}
              className="text-sm cursor-pointer"
            >
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage src={org.logo || org.logoUrl} alt={org.name} />
                <AvatarFallback>
                  {org.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{org.name}</span>
              <Check
                className={cn(
                  "ml-auto h-4 w-4",
                  activeOrgId === org.id ? "opacity-100" : "opacity-0"
                )}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
          <Plus className="mr-2 h-4 w-4" />
          Create Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
