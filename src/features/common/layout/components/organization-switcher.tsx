"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import useSWR from "swr";

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

import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import {
  cn,
  getCookieValue,
  isJsonObject,
  ORG_SELECTION_COOKIE,
} from "@/lib/utils";

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

  const pickNonEmptyString = React.useCallback((...values: unknown[]) => {
    for (const value of values) {
      if (typeof value === "string" && value.trim().length > 0) return value;
    }
    return undefined;
  }, []);

  const toOrganization = React.useCallback(
    (raw: unknown): Organization | null => {
      if (!isJsonObject(raw)) return null;
      const id =
        typeof raw.id === "string"
          ? raw.id
          : typeof raw.organizationId === "string"
            ? raw.organizationId
            : undefined;
      if (!id) return null;
      return {
        id,
        name: typeof raw.name === "string" ? raw.name : "",
        slug: typeof raw.slug === "string" ? raw.slug : "",
        logo: typeof raw.logo === "string" ? raw.logo : undefined,
        logoUrl: typeof raw.logoUrl === "string" ? raw.logoUrl : undefined,
      };
    },
    []
  );

  const extractOrganizations = React.useCallback(
    (payload: unknown): Organization[] => {
      const root = Array.isArray(payload)
        ? payload
        : isJsonObject(payload) && Array.isArray(payload.data)
          ? payload.data
          : [];
      if (!Array.isArray(root)) return [];
      const mapped = root.map(toOrganization).filter(Boolean);
      return mapped as Organization[];
    },
    [toOrganization]
  );

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
          const payload: unknown = response.data;
          const orgs = extractOrganizations(payload);
          if (orgs.length > 0 || Array.isArray(payload)) {
            setOrganizations(orgs);
            hasLoadedOrganizationsRef.current = true;
            if (orgs.length === 0) console.warn("Organization list is empty.");
          } else {
            console.error("Expected array of organizations but got:", payload);
            setOrganizations([]);
          }
        } else {
          console.error(
            "Error fetching organizations status:",
            response.status
          );
          toast.error("Failed to load organizations");
        }
      } catch (error) {
        const err = error as { response?: { status?: number } };
        const status = err.response?.status;
        if (status !== 409) {
          console.error("Failed to fetch organizations exception", err);
        }
        if (status === 409) {
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
  }, [extractOrganizations, session?.user?.id]);

  React.useEffect(() => {
    const handler = () => {
      if (!session) return;
      setIsLoading(true);
      apiClient
        .get("/organization/list")
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            const payload: unknown = response.data;
            setOrganizations(extractOrganizations(payload));
          }
        })
        .finally(() => setIsLoading(false));
    };

    window.addEventListener("onchain:org-changed", handler);
    return () => window.removeEventListener("onchain:org-changed", handler);
  }, [extractOrganizations, session]);

  const confirmedActiveOrgId =
    selectedOrgCookie && activeOrgId && selectedOrgCookie === activeOrgId
      ? activeOrgId
      : null;

  const activeOrg = organizations.find(
    (org) => org.id === confirmedActiveOrgId
  );

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

  const brandingPayload: unknown = branding;
  const brandingData =
    isJsonObject(brandingPayload) && "data" in brandingPayload
      ? brandingPayload.data
      : brandingPayload;
  const brandingObj = isJsonObject(brandingData) ? brandingData : undefined;
  const activeOrgLogo =
    (typeof brandingObj?.primaryLogo === "string"
      ? brandingObj.primaryLogo
      : undefined) ??
    (typeof brandingObj?.logoUrl === "string"
      ? brandingObj.logoUrl
      : undefined) ??
    (typeof brandingObj?.logo === "string" ? brandingObj.logo : undefined);

  // Debug log if active org is missing but ID is set
  React.useEffect(() => {
    if (
      activeOrgId &&
      organizations.length > 0 &&
      confirmedActiveOrgId &&
      !activeOrg
    ) {
      console.warn(
        `Active Org ID ${activeOrgId} not found in organizations list`,
        organizations
      );
    }
  }, [activeOrgId, organizations, activeOrg, confirmedActiveOrgId]);

  const setSelectedOrgCookieValue = React.useCallback((orgId: string) => {
    if (typeof document === "undefined") return;
    document.cookie = `${ORG_SELECTION_COOKIE}=${encodeURIComponent(orgId)}; path=/; samesite=lax`;
    setSelectedOrgCookie(orgId);
  }, []);

  const handleSwitchOrg = React.useCallback(
    async (orgId: string, silent = false) => {
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
        const payload: unknown = response.data;
        const payloadObj = isJsonObject(payload) ? payload : undefined;
        const nestedData = isJsonObject(payloadObj?.data)
          ? payloadObj.data
          : undefined;
        const success = payloadObj
          ? (payloadObj.success ?? payloadObj.ok ?? nestedData?.success)
          : undefined;

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
          const payloadError = payloadObj?.error;
          const message =
            pickNonEmptyString(
              isJsonObject(payloadError) ? payloadError.message : undefined,
              payloadObj?.message,
              payloadError
            ) ?? "Failed to set active organization";
          throw new Error(String(message));
        }
      } catch (error) {
        const err = error as {
          message?: unknown;
          response?: { status?: number; data?: unknown };
        };
        const status = err.response?.status;
        const data = err.response?.data;
        const dataObj = isJsonObject(data) ? data : undefined;
        const nestedError = isJsonObject(dataObj?.error)
          ? dataObj.error
          : undefined;
        const message =
          pickNonEmptyString(
            nestedError?.message,
            dataObj?.message,
            dataObj?.error,
            err.message
          ) ?? "Failed to switch organization";

        if (status !== 409) {
          console.error("Failed to switch organization", err);
        }
        window.dispatchEvent(
          new CustomEvent("onchain:org-switch-failed", {
            detail: {
              orgId,
              previousOrgId: activeOrgId,
              message: String(message),
            },
          })
        );
        toast.error(String(message));
      } finally {
        setIsLoading(false);
      }
    },
    [activeOrgId, pickNonEmptyString, router, setSelectedOrgCookieValue]
  );

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
  }, [activeOrgId, handleSwitchOrg, isMounted, session]);

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
                <AvatarImage
                  src={activeOrgLogo}
                  alt={activeOrg?.name ?? "Org"}
                />
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
                {(org.logo ?? org.logoUrl) ? (
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
