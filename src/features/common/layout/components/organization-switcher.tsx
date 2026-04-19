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
import useSWR from "swr";

import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import { ORG_SELECTION_COOKIE, cn, getCookieValue } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
  const [selectedOrgCookie, setSelectedOrgCookie] = React.useState<
    string | null
  >(null);
  const lastAutoSyncOrgIdRef = React.useRef<string | null>(null);
  const hasLoadedOrganizationsRef = React.useRef(false);
  const router = useRouter();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;
    setSelectedOrgCookie(getCookieValue(ORG_SELECTION_COOKIE));
  }, [isMounted]);

  React.useEffect(() => {
    if (session?.session?.activeOrganizationId) {
      setActiveOrgId(session.session.activeOrganizationId);
    }
  }, [session?.session?.activeOrganizationId]);

  React.useEffect(() => {
    const fetchOrganizations = async () => {
      if (hasLoadedOrganizationsRef.current) return;
      setIsLoading(true);
      try {
        const response = await apiClient.get("/organization/list");
        if (response.status === 200) {
          const data = response.data;
          // Handle backend response wrapper: { success: true, data: [...] } or direct array
          const orgs = Array.isArray(data) ? data : data.data || [];

          if (Array.isArray(orgs)) {
            setOrganizations(orgs as Organization[]);
            hasLoadedOrganizationsRef.current = true;
            if (orgs.length === 0) {
              console.warn("Organization list is empty.");
            }
          } else {
            console.error("Expected array of organizations but got:", data);
            setOrganizations([]);
          }
        } else {
          console.error(
            "Error fetching organizations status:",
            response.status
          );
          toast.error("Failed to load organizations");
        }
      } catch (error: any) {
        if (error?.response?.status !== 409) {
          console.error("Failed to fetch organizations exception", error);
        }
        if (error?.response?.status === 409) {
          setOrganizations([]);
          return;
        }
        // Toast handled by interceptor if we wanted, but keep for explicit UI feedback
        toast.error("Network error loading organizations");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchOrganizations();
    }
  }, [session?.user?.id]);

  React.useEffect(() => {
    const handler = () => {
      if (!session) return;
      setIsLoading(true);
      apiClient
        .get("/organization/list")
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            const data = response.data as any;
            const orgs = Array.isArray(data) ? data : data.data || [];
            setOrganizations(Array.isArray(orgs) ? (orgs as Organization[]) : []);
          }
        })
        .finally(() => setIsLoading(false));
    };

    window.addEventListener("onchain:org-changed", handler as any);
    return () =>
      window.removeEventListener("onchain:org-changed", handler as any);
  }, [session]);

  const confirmedActiveOrgId =
    selectedOrgCookie && activeOrgId && selectedOrgCookie === activeOrgId
      ? activeOrgId
      : null;

  const activeOrg = organizations.find((org) => org.id === confirmedActiveOrgId);

  const fetcher = React.useCallback(async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }, []);

  const { data: branding } = useSWR(
    confirmedActiveOrgId ? "/api/v1/organization/branding" : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60_000 }
  );

  const brandingData = (branding as any)?.data ?? (branding as any);
  const activeOrgLogo =
    (brandingData?.primaryLogo as string | undefined) ??
    (brandingData?.logoUrl as string | undefined) ??
    (brandingData?.logo as string | undefined);

  // Debug log if active org is missing but ID is set
  React.useEffect(() => {
    if (activeOrgId && organizations.length > 0 && confirmedActiveOrgId && !activeOrg) {
      console.warn(
        `Active Org ID ${activeOrgId} not found in organizations list`,
        organizations
      );
    }
  }, [activeOrgId, organizations, activeOrg, confirmedActiveOrgId]);

  const setSelectedOrgCookieValue = (orgId: string) => {
    if (typeof document === "undefined") return;
    document.cookie = `${ORG_SELECTION_COOKIE}=${encodeURIComponent(orgId)}; path=/; samesite=lax`;
    setSelectedOrgCookie(orgId);
  };

  const handleSwitchOrg = async (orgId: string, silent = false) => {
    if (orgId === activeOrgId) {
      setSelectedOrgCookieValue(orgId);
      window.dispatchEvent(
        new CustomEvent("onchain:org-changed", {
          detail: { orgId, previousOrgId: activeOrgId },
        })
      );
      router.refresh();
      return;
    }

    window.dispatchEvent(
      new CustomEvent("onchain:org-switch-start", {
        detail: { orgId, previousOrgId: activeOrgId },
      })
    );

    setIsLoading(true);
    try {
      const response = await apiClient.post("/organization/set-active", {
        organizationId: orgId,
        organization_id: orgId,
      });

      const ok = response.status >= 200 && response.status < 300;
      const payload = response.data as any;
      const success =
        payload?.success ?? payload?.ok ?? payload?.data?.success ?? undefined;

      if (ok && success !== false) {
        setSelectedOrgCookieValue(orgId);
        setActiveOrgId(orgId);
        if (!silent) toast.success("Switched organization");
        await authClient.getSession();
        window.dispatchEvent(
          new CustomEvent("onchain:org-changed", {
            detail: { orgId, previousOrgId: activeOrgId },
          })
        );
        router.refresh();
      } else {
        const message =
          payload?.error?.message ||
          payload?.message ||
          payload?.error ||
          "Failed to set active organization";
        throw new Error(String(message));
      }
    } catch (err) {
      const error = err as any;
      const status = error?.response?.status;
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to switch organization";

      if (status !== 409) {
        console.error("Failed to switch organization", error);
      }
      window.dispatchEvent(
        new CustomEvent("onchain:org-switch-failed", {
          detail: { orgId, previousOrgId: activeOrgId, message: String(message) },
        })
      );
      toast.error(String(message));
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!isMounted || !session) return;
    const cookieOrgId = getCookieValue(ORG_SELECTION_COOKIE);
    setSelectedOrgCookie(cookieOrgId);
    if (!cookieOrgId) return;
    if (lastAutoSyncOrgIdRef.current === cookieOrgId) return;
    if (!activeOrgId || activeOrgId !== cookieOrgId) {
      lastAutoSyncOrgIdRef.current = cookieOrgId;
      handleSwitchOrg(cookieOrgId, true);
    }
  }, [isMounted, session, activeOrgId]);

  if (!isMounted || !session) {
    return (
      <Button
        variant="outline"
        role="combobox"
        aria-label="Loading organization"
        className="h-10 w-[230px] justify-between rounded-xl border-border/70 bg-card/60 px-2.5"
        disabled
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Skeleton className="h-6 w-6 rounded-full shrink-0" />
          <Skeleton className="h-4 w-24" />
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
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
          className={cn(
            "h-10 w-[230px] justify-between rounded-xl border-border/70 bg-card/60 px-2.5",
            "shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-card"
          )}
          disabled={isLoading}
        >
          <div className="flex min-w-0 items-center gap-2 overflow-hidden">
            <Avatar className="h-6 w-6 shrink-0 ring-1 ring-border/60">
              {activeOrgLogo ? (
                <AvatarImage src={activeOrgLogo} alt={activeOrg?.name ?? "Org"} />
              ) : null}
              <AvatarFallback>
                {activeOrg?.name?.substring(0, 2).toUpperCase() ?? "OR"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-left">
              <div className="truncate text-sm font-medium">
                {activeOrg?.name ?? "Select Organization"}
              </div>
              <div className="truncate text-[10px] uppercase tracking-wide text-muted-foreground">
                {isLoading ? "Switching..." : "Workspace"}
              </div>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[260px] rounded-xl border-border/70 p-1.5 shadow-xl"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Organizations
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onSelect={() => handleSwitchOrg(org.id)}
              className="cursor-pointer rounded-lg px-2 py-2 text-sm"
            >
              <Avatar className="mr-2 h-6 w-6 ring-1 ring-border/50">
                {org.logo ?? org.logoUrl ? (
                  <AvatarImage src={org.logo ?? org.logoUrl} alt={org.name} />
                ) : null}
                <AvatarFallback>
                  {org.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate font-medium">{org.name}</div>
                <div className="truncate text-[10px] uppercase tracking-wide text-muted-foreground">
                  {org.slug}
                </div>
              </div>
              <Check
                className={cn(
                  "ml-auto h-4 w-4 text-primary",
                  confirmedActiveOrgId === org.id ? "opacity-100" : "opacity-0"
                )}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled
          className="cursor-not-allowed rounded-lg px-2 py-2 opacity-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
