"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronRight,
  Globe2,
  KeyRound,
  Loader2,
  MailPlus,
  Palette,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import CompanyEditForm from "@/features/settings/components/account/company-edit-form";
import InviteUser from "@/features/settings/components/invite-user";
import LogoUpload from "@/features/settings/components/logo-upload";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { getSelectedOrganizationId, isJsonObject } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { fadeInUp } from "@/features/settings/utils";
import SettingsSectionCard from "@/features/settings/components/settings-section-card";

type LogoType = "primary" | "dark" | "favicon";
type SenderStatus = "verified" | "pending" | "failed";

interface BrandingState {
  primaryLogoUrl?: string;
  darkLogoUrl?: string;
  faviconUrl?: string;
}

interface DomainRow {
  id: string;
  domain: string;
  dkim: boolean;
  spf: boolean;
  status: SenderStatus;
}

interface DomainDnsRow {
  id: string;
  host: string;
  type: string;
  value: string;
  ttl?: string;
  priority?: string;
  verified?: boolean;
  status?: SenderStatus | "unknown";
  databaseField?: string;
}

interface DomainStatusCheck {
  key: string;
  label: string;
  passed: boolean | null;
}

interface DomainStatusState {
  status: SenderStatus;
  checks: DomainStatusCheck[];
}

interface SenderIdentityRow {
  id: string;
  email: string;
  name: string;
  domain: string;
  dkim: boolean;
  spf: boolean;
  status: SenderStatus;
  isDefault: boolean;
}

interface TeamPermissions {
  canManageMembers: boolean;
  canManageSenderIdentities: boolean;
  canEditCampaigns: boolean;
  canSendEmail: boolean;
  canLaunchCampaigns: boolean;
  canViewSettings: boolean;
}

interface TeamRow {
  id: string;
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  avatar: string;
  twoFactorEnabled: boolean | null;
  isEnabled: boolean;
  kind: "member" | "invite";
  permissions?: TeamPermissions;
}

const defaultBrandingState: BrandingState = {};

const getSenderStatusTone = (status: string) => {
  switch (status.toLowerCase()) {
    case "verified":
      return "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300";
    case "pending":
      return "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300";
    case "failed":
      return "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const unwrapData = (payload: unknown): unknown => {
  if (isJsonObject(payload) && "data" in payload) {
    return payload.data ?? payload;
  }
  return payload;
};

const toArray = (payload: unknown): unknown[] => {
  const root = unwrapData(payload);
  if (Array.isArray(root)) return root;
  if (isJsonObject(root) && Array.isArray(root.items)) return root.items;
  if (isJsonObject(root) && Array.isArray(root.data)) return root.data;
  return [];
};

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0)
      return value.trim();
  }
  return undefined;
};

const pickBoolean = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (
        ["pass", "passed", "verified", "true", "valid", "ok"].includes(
          normalized
        )
      ) {
        return true;
      }
      if (
        ["fail", "failed", "false", "invalid", "pending"].includes(normalized)
      ) {
        return false;
      }
    }
  }
  return undefined;
};

const normalizeRoleLabel = (value: unknown) => {
  if (typeof value !== "string") return "Viewer";
  const normalized = value.trim().replace(/[_-]+/g, " ").toLowerCase();
  if (normalized.length === 0) return "Viewer";
  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
};

const normalizePermissions = (value: unknown): TeamPermissions | undefined => {
  if (!isJsonObject(value)) return undefined;
  return {
    canManageMembers: pickBooleanLike(value.canManageMembers) ?? false,
    canManageSenderIdentities:
      pickBooleanLike(value.canManageSenderIdentities) ?? false,
    canEditCampaigns: pickBooleanLike(value.canEditCampaigns) ?? false,
    canSendEmail: pickBooleanLike(value.canSendEmail) ?? false,
    canLaunchCampaigns: pickBooleanLike(value.canLaunchCampaigns) ?? false,
    canViewSettings: pickBooleanLike(value.canViewSettings) ?? false,
  };
};

const pickBooleanLike = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") {
      if (value === 1) return true;
      if (value === 0) return false;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (
        [
          "true",
          "1",
          "pass",
          "passed",
          "verified",
          "valid",
          "ok",
          "active",
          "configured",
          "present",
          "exists",
          "found",
          "healthy",
        ].includes(normalized)
      ) {
        return true;
      }
      if (
        [
          "false",
          "0",
          "fail",
          "failed",
          "invalid",
          "missing",
          "not_found",
          "not found",
          "unverified",
        ].includes(normalized)
      ) {
        return false;
      }
    }
  }
  return undefined;
};

const resolveStatus = (...values: unknown[]): SenderStatus => {
  for (const value of values) {
    if (typeof value !== "string") continue;
    const normalized = value.trim().toLowerCase();
    if (normalized.includes("ver")) return "verified";
    if (normalized.includes("pend")) return "pending";
    if (normalized.includes("fail")) return "failed";
  }
  return "pending";
};

const resolveAuthBooleans = ({
  dkim,
  spf,
  status,
}: {
  dkim?: boolean;
  spf?: boolean;
  status: SenderStatus;
}) => {
  if (status === "verified") {
    return {
      dkim: dkim ?? true,
      spf: spf ?? true,
    };
  }

  return {
    dkim: dkim ?? false,
    spf: spf ?? false,
  };
};

const resolveDomainRowStatus = ({
  dkim,
  spf,
  fallbackStatus,
}: {
  dkim: boolean;
  spf: boolean;
  fallbackStatus: SenderStatus;
}): SenderStatus => {
  if (dkim && spf) return "verified";
  if (!dkim || !spf) return "pending";
  return fallbackStatus;
};

const getBackendAssetOrigin = () => {
  const rawBase = pickString(process.env.NEXT_PUBLIC_BACKEND_URL);
  if (!rawBase) return undefined;
  try {
    const parsed = new URL(rawBase);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return undefined;
  }
};

const resolveBrandAssetUrl = (...values: unknown[]) => {
  const raw = pickString(...values);
  if (!raw) return undefined;
  if (
    raw.startsWith("data:") ||
    raw.startsWith("blob:") ||
    /^https?:\/\//i.test(raw)
  ) {
    return raw;
  }
  if (raw.startsWith("//")) return `https:${raw}`;

  const backendOrigin = getBackendAssetOrigin();
  if (raw.startsWith("/")) {
    return backendOrigin ? `${backendOrigin}${raw}` : raw;
  }
  return backendOrigin ? `${backendOrigin}/${raw.replace(/^\/+/, "")}` : raw;
};

const extractDomainMap = (payload: unknown) => {
  const map = new Map<
    string,
    { dkim?: boolean; spf?: boolean; status?: SenderStatus }
  >();
  const root = unwrapData(payload);

  if (Array.isArray(root)) {
    for (const entry of root) {
      if (!isJsonObject(entry)) continue;
      const domain = pickString(
        entry.domain,
        entry.name,
        entry.hostname,
        entry.host
      );
      if (!domain) continue;
      const dkim = pickBoolean(
        entry.dkim,
        entry.dkimValid,
        entry.dkimVerified,
        entry.dkimStatus
      );
      const spf = pickBoolean(
        entry.spf,
        entry.spfValid,
        entry.spfVerified,
        entry.spfStatus
      );
      const status = resolveStatus(
        entry.status,
        entry.verificationStatus,
        entry.state,
        dkim && spf ? "verified" : dkim || spf ? "pending" : "failed"
      );
      const authState = resolveAuthBooleans({ dkim, spf, status });
      map.set(domain, {
        dkim: authState.dkim,
        spf: authState.spf,
        status,
      });
    }
    return map;
  }

  if (!isJsonObject(root)) return map;
  for (const [domain, value] of Object.entries(root)) {
    if (!isJsonObject(value)) continue;
    const dkim = pickBoolean(
      value.dkim,
      value.dkimValid,
      value.dkimVerified,
      value.dkimStatus
    );
    const spf = pickBoolean(
      value.spf,
      value.spfValid,
      value.spfVerified,
      value.spfStatus
    );
    const status = resolveStatus(
      value.status,
      value.verificationStatus,
      value.state,
      dkim && spf ? "verified" : dkim || spf ? "pending" : "failed"
    );
    const authState = resolveAuthBooleans({ dkim, spf, status });
    map.set(domain, {
      dkim: authState.dkim,
      spf: authState.spf,
      status,
    });
  }
  return map;
};

const normalizeBranding = (brandingPayload: unknown): BrandingState => {
  const brandingRoot = unwrapData(brandingPayload);
  const branding = isJsonObject(brandingRoot) ? brandingRoot : {};
  const logoPreview = isJsonObject(branding.logoPreview)
    ? branding.logoPreview
    : {};
  const logos = isJsonObject(branding.logos)
    ? branding.logos
    : isJsonObject(branding.assets)
      ? branding.assets
      : {};

  return {
    primaryLogoUrl: resolveBrandAssetUrl(
      logoPreview.primaryUrl,
      branding.primaryLogoUrl,
      branding.primaryLogo,
      logos.primaryLogoUrl,
      logos.primaryLogo,
      logos.primary,
      branding.logoUrl,
      branding.logo
    ),
    darkLogoUrl: resolveBrandAssetUrl(
      logoPreview.darkUrl,
      branding.darkLogoUrl,
      branding.darkLogo,
      branding.darkModeLogo,
      logos.darkLogoUrl,
      logos.darkLogo,
      logos.dark,
      logos.darkModeLogo
    ),
    faviconUrl: resolveBrandAssetUrl(
      logoPreview.faviconUrl,
      branding.faviconUrl,
      branding.favicon,
      logos.faviconUrl,
      logos.favicon,
      logos.icon
    ),
  };
};

const normalizeDomains = (
  payload: unknown,
  domainMap: Map<
    string,
    { dkim?: boolean; spf?: boolean; status?: SenderStatus }
  >
): DomainRow[] => {
  const rows = toArray(payload)
    .map((entry, index) => {
      if (!isJsonObject(entry)) return null;
      const domain = pickString(
        entry.domain,
        entry.name,
        entry.hostname,
        entry.host
      );
      if (!domain) return null;
      const authState = domainMap.get(domain);
      const dkim =
        pickBoolean(
          entry.dkim,
          entry.dkimValid,
          entry.dkimVerified,
          entry.dkimStatus
        ) ??
        authState?.dkim ??
        false;
      const spf =
        pickBoolean(
          entry.spf,
          entry.spfValid,
          entry.spfVerified,
          entry.spfStatus
        ) ??
        authState?.spf ??
        false;
      const status = resolveStatus(
        entry.status,
        entry.verificationStatus,
        entry.state,
        authState?.status,
        dkim && spf ? "verified" : dkim || spf ? "pending" : "failed"
      );
      const resolvedAuth = resolveAuthBooleans({ dkim, spf, status });
      const resolvedStatus = resolveDomainRowStatus({
        dkim: resolvedAuth.dkim,
        spf: resolvedAuth.spf,
        fallbackStatus: status,
      });

      return {
        id: pickString(entry.id, entry.domainId) ?? `${domain}-${index}`,
        domain,
        dkim: resolvedAuth.dkim,
        spf: resolvedAuth.spf,
        status: resolvedStatus,
      } satisfies DomainRow;
    })
    .filter((row): row is DomainRow => Boolean(row));

  if (rows.length > 0) return rows;

  return Array.from(domainMap.entries()).map(([domain, authState], index) => {
    const status =
      authState.status ??
      (authState.dkim && authState.spf
        ? "verified"
        : authState.dkim || authState.spf
          ? "pending"
          : "failed");
    const resolvedAuth = resolveAuthBooleans({
      dkim: authState.dkim,
      spf: authState.spf,
      status,
    });
    const resolvedStatus = resolveDomainRowStatus({
      dkim: resolvedAuth.dkim,
      spf: resolvedAuth.spf,
      fallbackStatus: status,
    });
    return {
      id: `${domain}-${index}`,
      domain,
      dkim: resolvedAuth.dkim,
      spf: resolvedAuth.spf,
      status: resolvedStatus,
    };
  });
};

const normalizeDomainDns = (payload: unknown): DomainDnsRow[] => {
  return toArray(payload)
    .map((entry, index): DomainDnsRow | null => {
      if (!isJsonObject(entry)) return null;
      const host = pickString(
        entry.host,
        entry.hostname,
        entry.name,
        entry.recordName
      );
      const type = pickString(entry.type, entry.recordType);
      const value = pickString(
        entry.value,
        entry.content,
        entry.target,
        entry.recordValue
      );
      if (!host || !type || !value) return null;
      const verified = pickBooleanLike(
        entry.verified,
        entry.isVerified,
        entry.valid,
        entry.isValid,
        entry.active,
        entry.exists,
        entry.present,
        entry.configured,
        entry.propagated,
        entry.matched,
        entry.recordVerified,
        entry.recordStatus,
        entry.status
      );
      return {
        id: pickString(entry.id) ?? `${host}-${type}-${index}`,
        host,
        type,
        value,
        ttl: pickString(entry.ttl),
        priority: pickString(entry.priority),
        verified,
        status:
          verified === true
            ? "verified"
            : verified === false
              ? "failed"
              : "unknown",
        databaseField: pickString(
          entry.category,
          entry.purpose,
          entry.kind,
          entry.field
        ),
      } satisfies DomainDnsRow;
    })
    .filter((row): row is DomainDnsRow => row !== null);
};

const normalizeDomainStatus = (payload: unknown): DomainStatusState => {
  const root = unwrapData(payload);
  const source = isJsonObject(root) ? root : {};

  const checks: DomainStatusCheck[] = [
    {
      key: "dkim",
      label: "DKIM",
      passed:
        pickBooleanLike(
          source.dkim,
          source.dkimValid,
          source.dkimVerified,
          source.dkimStatus
        ) ?? null,
    },
    {
      key: "spf",
      label: "SPF",
      passed:
        pickBooleanLike(
          source.spf,
          source.spfValid,
          source.spfVerified,
          source.spfStatus
        ) ?? null,
    },
  ];

  return {
    status: resolveStatus(
      source.status,
      source.verificationStatus,
      source.state,
      checks.every((check) => check.passed === true)
        ? "verified"
        : checks.some((check) => check.passed === false)
          ? "failed"
          : "pending"
    ),
    checks,
  };
};

const inferDnsCheckKey = (record: DomainDnsRow): string | null => {
  const haystack = [
    record.databaseField,
    record.host,
    record.type,
    record.value,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (haystack.includes("domainkey") || haystack.includes("dkim"))
    return "dkim";
  if (
    haystack.includes("spf") ||
    (record.type.toUpperCase() === "TXT" && haystack.includes("v=spf1"))
  ) {
    return "spf";
  }
  return null;
};

const normalizeSenders = (
  payload: unknown,
  domainMap: Map<string, { dkim?: boolean; spf?: boolean }>
): SenderIdentityRow[] => {
  return toArray(payload)
    .map((entry, index) => {
      if (!isJsonObject(entry)) return null;
      const email = pickString(
        entry.email,
        entry.senderEmail,
        entry.address,
        entry.fromEmail
      );
      if (!email) return null;
      const domain = email.includes("@") ? (email.split("@").pop() ?? "") : "";
      const domainState = domainMap.get(domain);
      const dkim =
        pickBoolean(
          entry.dkim,
          entry.dkimValid,
          entry.dkimVerified,
          entry.dkimStatus
        ) ??
        domainState?.dkim ??
        false;
      const spf =
        pickBoolean(
          entry.spf,
          entry.spfValid,
          entry.spfVerified,
          entry.spfStatus
        ) ??
        domainState?.spf ??
        false;
      const status = resolveStatus(
        entry.status,
        entry.verificationStatus,
        entry.state,
        dkim && spf ? "verified" : dkim || spf ? "pending" : "failed"
      );
      return {
        id:
          pickString(entry.id, entry.senderId, entry.identityId) ??
          `${email}-${index}`,
        email,
        name:
          pickString(entry.name, entry.senderName, entry.displayName) ??
          email.split("@")[0] ??
          "Sender",
        domain,
        dkim,
        spf,
        status,
        isDefault:
          pickBooleanLike(entry.isDefault, entry.default, entry.isPrimary) ??
          false,
      } satisfies SenderIdentityRow;
    })
    .filter((row): row is SenderIdentityRow => Boolean(row))
    .sort((left, right) => {
      if (left.isDefault !== right.isDefault) return left.isDefault ? -1 : 1;
      return left.email.localeCompare(right.email);
    });
};

const normalizeMembers = (payload: unknown): TeamRow[] => {
  return toArray(payload)
    .map((entry, index) => {
      if (!isJsonObject(entry)) return null;
      const email = pickString(entry.email, entry.userEmail);
      if (!email) return null;
      const name =
        pickString(entry.name, entry.fullName, entry.userName) ?? email;
      return {
        id: pickString(entry.userId, entry.id) ?? `${email}-${index}`,
        name,
        email,
        role:
          pickString(entry.role)?.toUpperCase() ??
          pickString(entry.roleLabel)?.toUpperCase() ??
          "VIEWER",
        roleLabel: normalizeRoleLabel(entry.roleLabel ?? entry.role),
        avatar: name.charAt(0).toUpperCase(),
        twoFactorEnabled:
          pickBoolean(entry.twoFactorEnabled, entry.twoFAEnabled) ?? false,
        isEnabled: pickBoolean(entry.isEnabled, entry.enabled, true) ?? true,
        kind: "member",
        permissions: normalizePermissions(entry.permissions),
      } satisfies TeamRow;
    })
    .filter(Boolean) as TeamRow[];
};

const normalizeInvites = (payload: unknown): TeamRow[] => {
  return toArray(payload)
    .map((entry, index) => {
      if (!isJsonObject(entry)) return null;
      const email = pickString(entry.email);
      if (!email) return null;
      const role = pickString(entry.role) ?? "Viewer";
      return {
        id: pickString(entry.id, entry.inviteId) ?? `${email}-${index}`,
        name: pickString(entry.name, entry.invitedName) ?? "Pending invite",
        email,
        role: pickString(entry.role)?.toUpperCase() ?? "VIEWER",
        roleLabel: normalizeRoleLabel(entry.roleLabel ?? role),
        avatar: email.charAt(0).toUpperCase(),
        twoFactorEnabled: null,
        isEnabled: true,
        kind: "invite",
        permissions: normalizePermissions(
          entry.plannedPermissions ?? entry.permissions
        ),
      } satisfies TeamRow;
    })
    .filter(Boolean) as TeamRow[];
};

const statusCell = (passed: boolean) => (
  <span
    className={
      passed
        ? "inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
        : "inline-flex items-center gap-1 text-rose-600 dark:text-rose-400"
    }
  >
    <span className="h-2 w-2 rounded-full bg-current" />
    {passed ? "Pass" : "Fail"}
  </span>
);

const LogoTile = ({
  label,
  spec,
  onClick,
  previewUrl,
}: {
  label: string;
  spec: string;
  onClick: () => void;
  previewUrl?: string;
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [previewUrl]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-border/60 bg-background/60 p-4 text-left transition hover:border-primary/35 hover:bg-background active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-foreground">{label}</div>
          <div className="mt-1 text-xs text-muted-foreground">{spec}</div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
      </div>
      <div className="mt-4 flex h-20 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/70 bg-muted/30">
        {previewUrl && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={label}
            className="h-full w-full object-contain p-3"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="text-xs text-muted-foreground">
            {previewUrl ? "Preview unavailable" : "Click to upload"}
          </div>
        )}
      </div>
    </button>
  );
};

export default function CompanySettingsView() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [logoModal, setLogoModal] = useState<{
    open: boolean;
    type: LogoType;
  }>({ open: false, type: "primary" });
  const [inviteOpen, setInviteOpen] = useState(false);
  const [addDomainOpen, setAddDomainOpen] = useState(false);
  const [addSenderOpen, setAddSenderOpen] = useState(false);
  const [domainName, setDomainName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [domainDnsDialog, setDomainDnsDialog] = useState<{
    open: boolean;
    domainId: string | null;
    domain: string;
  }>({ open: false, domainId: null, domain: "" });
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  useEffect(() => {
    const syncSelectedOrgId = () => {
      setSelectedOrgId(getSelectedOrganizationId());
    };

    syncSelectedOrgId();
    window.addEventListener("onchain:org-changed", syncSelectedOrgId);
    return () =>
      window.removeEventListener("onchain:org-changed", syncSelectedOrgId);
  }, []);

  const organizationId = useMemo(() => {
    const selected = selectedOrgId?.trim();
    if (selected) return selected;
    const active = session?.session?.activeOrganizationId;
    return typeof active === "string" && active.trim().length > 0
      ? active.trim()
      : null;
  }, [selectedOrgId, session?.session?.activeOrganizationId]);

  const orgHeaders = useMemo(
    () =>
      organizationId
        ? {
            "x-org-id": organizationId,
            "x-onchain-silent-error": "1",
          }
        : undefined,
    [organizationId]
  );

  const brandingQuery = useQuery({
    queryKey: ["project-settings", "branding", organizationId],
    enabled: Boolean(organizationId && orgHeaders),
    retry: false,
    queryFn: async () => {
      const brandingRes = await apiClient.get("/organization/branding", {
        headers: orgHeaders,
      });
      return normalizeBranding(brandingRes.data);
    },
  });

  const senderQuery = useQuery({
    queryKey: ["project-settings", "senders", organizationId],
    enabled: Boolean(organizationId && orgHeaders),
    retry: false,
    queryFn: async () => {
      const [identitiesRes, domainsRes] = await Promise.all([
        apiClient.get("/sender-identities", { headers: orgHeaders }),
        apiClient
          .get("/sender-identities/domains/authentication", {
            headers: orgHeaders,
          })
          .catch(() => ({ data: [] })),
      ]);
      return normalizeSenders(
        identitiesRes.data,
        extractDomainMap(domainsRes.data)
      );
    },
  });

  const domainQuery = useQuery({
    queryKey: ["project-settings", "domains", organizationId],
    enabled: Boolean(organizationId && orgHeaders),
    retry: false,
    queryFn: async () => {
      const [domainsRes, domainAuthRes] = await Promise.all([
        apiClient
          .get("/domain", { headers: orgHeaders })
          .catch(() => ({ data: [] })),
        apiClient
          .get("/sender-identities/domains/authentication", {
            headers: orgHeaders,
          })
          .catch(() => ({ data: [] })),
      ]);
      return normalizeDomains(
        domainsRes.data,
        extractDomainMap(domainAuthRes.data)
      );
    },
  });

  const domainDnsQuery = useQuery({
    queryKey: ["project-settings", "domain-dns", domainDnsDialog.domainId],
    enabled: Boolean(
      domainDnsDialog.open && domainDnsDialog.domainId && orgHeaders
    ),
    retry: false,
    queryFn: async () => {
      const [dnsResponse, statusResponse] = await Promise.all([
        apiClient.get(`/domain/${domainDnsDialog.domainId}/dns`, {
          headers: orgHeaders,
        }),
        apiClient.get(`/domain/${domainDnsDialog.domainId}/status`, {
          headers: orgHeaders,
        }),
      ]);
      return {
        records: normalizeDomainDns(dnsResponse.data),
        status: normalizeDomainStatus(statusResponse.data),
      };
    },
  });

  const membersQuery = useQuery({
    queryKey: ["project-settings", "members", organizationId],
    enabled: Boolean(organizationId && orgHeaders),
    retry: false,
    queryFn: async () => {
      const [membersRes, invitesRes] = await Promise.all([
        apiClient.get(`/organizations/${organizationId}/members`, {
          headers: orgHeaders,
        }),
        apiClient
          .get(`/organizations/${organizationId}/invites`, {
            headers: orgHeaders,
          })
          .catch(() => ({ data: [] })),
      ]);
      return [
        ...normalizeMembers(membersRes.data),
        ...normalizeInvites(invitesRes.data),
      ];
    },
  });

  const addSenderMutation = useMutation({
    mutationFn: async () => {
      if (!orgHeaders) throw new Error("No active organization selected");
      if (senderEmail.trim().length === 0) {
        throw new Error("Sender email is required");
      }
      return apiClient.post(
        "/sender-identities",
        {
          email: senderEmail.trim(),
          name: senderName.trim() || undefined,
        },
        { headers: orgHeaders }
      );
    },
    onSuccess: async () => {
      setAddSenderOpen(false);
      setSenderEmail("");
      setSenderName("");
      await queryClient.invalidateQueries({
        queryKey: ["project-settings", "senders", organizationId],
      });
      toast.success("Sender added");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add sender"
      );
    },
  });

  const addDomainMutation = useMutation({
    mutationFn: async () => {
      if (!orgHeaders) throw new Error("No active organization selected");
      const cleanedDomain = domainName
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/.*$/, "");
      if (!cleanedDomain) throw new Error("Domain is required");
      return apiClient.post(
        "/domain",
        { domain: cleanedDomain },
        { headers: orgHeaders }
      );
    },
    onSuccess: async () => {
      setAddDomainOpen(false);
      setDomainName("");
      await queryClient.invalidateQueries({
        queryKey: ["project-settings", "domains", organizationId],
      });
      toast.success("Domain added");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add domain"
      );
    },
  });

  const recheckSenderMutation = useMutation({
    mutationFn: async (senderId: string) => {
      if (!orgHeaders) throw new Error("No active organization selected");
      await apiClient.post(
        `/sender-identities/${senderId}/recheck`,
        {},
        { headers: orgHeaders }
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["project-settings", "senders", organizationId],
      });
      toast.success("Sender verification recheck started");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to recheck sender"
      );
    },
  });

  const recheckDomainMutation = useMutation({
    mutationFn: async (domainId: string) => {
      if (!orgHeaders) throw new Error("No active organization selected");
      await apiClient.post(
        `/domain/${domainId}/recheck`,
        {},
        { headers: orgHeaders }
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["project-settings", "domains", organizationId],
      });
      toast.success("Domain recheck started");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to recheck domain"
      );
    },
  });

  const autoConfigureDomainDnsMutation = useMutation({
    mutationFn: async (domainId: string) => {
      if (!orgHeaders) throw new Error("No active organization selected");
      await apiClient.post(
        `/domain/${domainId}/dns/auto`,
        {},
        { headers: orgHeaders }
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["project-settings", "domains", organizationId],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            "project-settings",
            "domain-dns",
            domainDnsDialog.domainId,
          ],
        }),
      ]);
      toast.success("DNS auto-configuration started");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to auto-configure DNS"
      );
    },
  });

  const branding = brandingQuery.data ?? defaultBrandingState;
  const domains = domainQuery.data ?? [];
  const domainDnsRecords = domainDnsQuery.data?.records ?? [];
  const domainDnsStatus = domainDnsQuery.data?.status;
  const senders = senderQuery.data ?? [];
  const teamMembers = useMemo(() => {
    const rows = membersQuery.data ?? [];
    const sessionEmail = pickString(session?.user?.email);
    if (!sessionEmail) return rows;
    const alreadyPresent = rows.some(
      (member) => member.email.toLowerCase() === sessionEmail.toLowerCase()
    );
    if (alreadyPresent) return rows;

    return [
      {
        id:
          pickString(session?.user?.id, session?.session?.userId) ??
          sessionEmail,
        name: pickString(session?.user?.name, sessionEmail) ?? sessionEmail,
        email: sessionEmail,
        role:
          pickString(
            isJsonObject(session?.user)
              ? (session.user as Record<string, unknown>).role
              : undefined
          ) ?? "MEMBER",
        roleLabel:
          normalizeRoleLabel(
            isJsonObject(session?.user)
              ? ((session.user as Record<string, unknown>).roleLabel ??
                  (session.user as Record<string, unknown>).role)
              : undefined
          ) || "Member",
        avatar: sessionEmail.charAt(0).toUpperCase(),
        twoFactorEnabled:
          pickBoolean(
            isJsonObject(session?.user)
              ? session.user.twoFactorEnabled
              : undefined
          ) ?? null,
        isEnabled: true,
        kind: "member" as const,
        permissions: normalizePermissions(
          isJsonObject(session?.user)
            ? (session.user as Record<string, unknown>).permissions
            : undefined
        ),
      },
      ...rows,
    ];
  }, [membersQuery.data, session]);

  const senderSummary = useMemo(
    () => ({
      total: senders.length,
      verified: senders.filter((sender) => sender.status === "verified").length,
      pending: senders.filter((sender) => sender.status === "pending").length,
    }),
    [senders]
  );

  const domainSummary = useMemo(
    () => ({
      total: domains.length,
      verified: domains.filter((domain) => domain.status === "verified").length,
      pending: domains.filter((domain) => domain.status === "pending").length,
    }),
    [domains]
  );
  const failingDomainChecks = useMemo(
    () =>
      (domainDnsStatus?.checks ?? []).filter((check) => check.passed === false),
    [domainDnsStatus]
  );
  const teamSummary = useMemo(() => {
    const activeMembers = teamMembers.filter(
      (member) => member.kind === "member"
    );
    const pendingInvites = teamMembers.filter(
      (member) => member.kind === "invite"
    );
    const enabledMembers = activeMembers.filter((member) => member.isEnabled);
    const sendCapableMembers = enabledMembers.filter(
      (member) => member.permissions?.canSendEmail === true
    );
    const roleCounts = activeMembers.reduce<Record<string, number>>(
      (acc, member) => {
        acc[member.roleLabel] = (acc[member.roleLabel] ?? 0) + 1;
        return acc;
      },
      {}
    );

    return {
      activeMembers: activeMembers.length,
      enabledMembers: enabledMembers.length,
      sendCapableMembers: sendCapableMembers.length,
      pendingInvites: pendingInvites.length,
      roleCounts,
    };
  }, [teamMembers]);
  const currentMemberPermissions = useMemo(() => {
    const sessionEmail = pickString(session?.user?.email)?.toLowerCase();
    if (!sessionEmail) return undefined;
    return teamMembers.find(
      (member) =>
        member.kind === "member" &&
        member.email.toLowerCase() === sessionEmail &&
        member.isEnabled
    )?.permissions;
  }, [session?.user?.email, teamMembers]);
  const canManageSenderIdentities =
    currentMemberPermissions?.canManageSenderIdentities !== false;

  return (
    <>
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        exit="exit"
        className="mx-auto max-w-6xl space-y-8 py-8"
      >
        <CompanyEditForm />
        <SettingsSectionCard
          title="Branding"
          description="Customize your brand appearance across all touchpoints."
          icon={<Palette className="h-5 w-5" />}
          badge="Brand kit"
        >
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Upload your logos for light and dark backgrounds
              </h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <LogoTile
                label="Primary logo"
                spec="SVG, PNG • 400×100px"
                previewUrl={branding.primaryLogoUrl}
                onClick={() => setLogoModal({ open: true, type: "primary" })}
              />
              <LogoTile
                label="Dark mode logo"
                spec="SVG, PNG • 400×100px"
                previewUrl={branding.darkLogoUrl}
                onClick={() => setLogoModal({ open: true, type: "dark" })}
              />
              <LogoTile
                label="Favicon"
                spec="ICO, PNG • 32×32px"
                previewUrl={branding.faviconUrl}
                onClick={() => setLogoModal({ open: true, type: "favicon" })}
              />
            </div>
          </section>
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Sender verification"
          description="Verify domains and set up sender infrastructure for branded organization sending."
          icon={<KeyRound className="h-5 w-5" />}
          badge={
            domainSummary.pending > 0
              ? `${domainSummary.pending} pending`
              : "Ready"
          }
        >
          <div className="space-y-5">
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setAddDomainOpen(true)}
                disabled={!organizationId || !canManageSenderIdentities}
              >
                <Globe2 className="mr-2 h-4 w-4" />
                Add domain
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setAddSenderOpen(true)}
                disabled={!organizationId || !canManageSenderIdentities}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add sender identity
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Domains
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground">
                  {domainSummary.total}
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Verified domains
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground">
                  {domainSummary.verified}
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Sender identities
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground">
                  {senderSummary.total}
                </div>
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Domain setup
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Register and verify your base domain before creating sender
                    identities or subdomains.
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full">
                  {domainSummary.pending > 0
                    ? `${domainSummary.pending} pending`
                    : "Ready"}
                </Badge>
              </div>

              {domainQuery.isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ) : domains.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/70 bg-background/50 p-6 text-sm text-muted-foreground">
                  No sending domains registered yet. Add a domain first, publish
                  its DNS records, then return here to verify it before creating
                  sender identities.
                </div>
              ) : (
                <div className="space-y-3">
                  {domains.map((domain) => (
                    <div
                      key={domain.id}
                      className="rounded-2xl border border-border/60 bg-background/60 p-4"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-medium text-foreground">
                              {domain.domain}
                            </div>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getSenderStatusTone(
                                domain.status
                              )}`}
                            >
                              {domain.status.charAt(0).toUpperCase() +
                                domain.status.slice(1)}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-4 text-sm">
                            <div>{statusCell(domain.dkim)}</div>
                            <div>{statusCell(domain.spf)}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-lg px-2"
                            onClick={() =>
                              setDomainDnsDialog({
                                open: true,
                                domainId: domain.id,
                                domain: domain.domain,
                              })
                            }
                          >
                            View DNS
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-lg px-2"
                            disabled={
                              !domain.id || recheckDomainMutation.isPending
                            }
                            onClick={() =>
                              recheckDomainMutation.mutate(domain.id)
                            }
                          >
                            {recheckDomainMutation.isPending ? (
                              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <RefreshCw className="mr-2 h-3.5 w-3.5" />
                            )}
                            Recheck
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4 border-t border-border/50 pt-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Sender identities
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add verified sender addresses and subdomains for branded
                    from-addresses, default sender selection, and domain-backed
                    deliverability.
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full">
                  {senderSummary.verified} verified
                </Badge>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Shared sending access
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Team roles control who can send. Sender identities are
                      optional workspace infrastructure the backend can use
                      first before falling back to the default or platform
                      sender.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      {teamSummary.sendCapableMembers} can send
                    </Badge>
                    <Badge variant="outline" className="rounded-full">
                      {senderSummary.verified} verified senders
                    </Badge>
                  </div>
                </div>
              </div>
              {!canManageSenderIdentities ? (
                <div className="rounded-2xl border border-dashed border-border/70 bg-background/50 p-4 text-sm text-muted-foreground">
                  Your role can view sender identities, but only owners and
                  admins can add, recheck, or manage them.
                </div>
              ) : null}

              {senderQuery.isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ) : senders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/70 bg-background/50 p-6 text-sm text-muted-foreground">
                  No sender identities found for this organization yet. Verify a
                  domain above, then add the sender addresses you want to use.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sender</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>DKIM</TableHead>
                      <TableHead>SPF</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {senders.map((sender) => (
                      <TableRow key={sender.email}>
                        <TableCell>
                          <div className="min-w-0">
                            <div className="font-medium text-foreground">
                              {sender.email}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              {sender.name}
                              {sender.isDefault ? (
                                <Badge
                                  variant="outline"
                                  className="rounded-full"
                                >
                                  Default
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{sender.domain}</TableCell>
                        <TableCell>{statusCell(sender.dkim)}</TableCell>
                        <TableCell>{statusCell(sender.spf)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getSenderStatusTone(
                              sender.status
                            )}`}
                          >
                            {sender.status.charAt(0).toUpperCase() +
                              sender.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-lg px-2"
                            disabled={
                              !sender.id ||
                              recheckSenderMutation.isPending ||
                              !canManageSenderIdentities
                            }
                            onClick={() =>
                              recheckSenderMutation.mutate(sender.id)
                            }
                          >
                            {recheckSenderMutation.isPending ? (
                              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <RefreshCw className="mr-2 h-3.5 w-3.5" />
                            )}
                            Recheck
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </section>
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Team members"
          description="Manage team access, sender access, and member roles."
          icon={<Users className="h-5 w-5" />}
          badge={`${teamSummary.activeMembers} active members`}
        >
          <div className="space-y-5">
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setInviteOpen(true)}
              >
                Invite user
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Active members
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground">
                  {teamSummary.activeMembers}
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Can send email
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground">
                  {teamSummary.sendCapableMembers}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Members with `canSendEmail`
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Pending invites
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground">
                  {teamSummary.pendingInvites}
                </div>
              </div>
            </div>

            {Object.keys(teamSummary.roleCounts).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(teamSummary.roleCounts)
                  .sort(([left], [right]) => left.localeCompare(right))
                  .map(([role, count]) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className="rounded-full"
                    >
                      {role}: {count}
                    </Badge>
                  ))}
              </div>
            ) : null}

            {membersQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/50 p-6 text-sm text-muted-foreground">
                No team members or pending invites yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>2FA</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 ring-1 ring-border/70">
                            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium text-foreground">
                              {member.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            member.twoFactorEnabled
                              ? "inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
                              : "inline-flex items-center gap-1 text-muted-foreground"
                          }
                        >
                          {member.twoFactorEnabled ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : member.twoFactorEnabled === null ? (
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-current" />
                          )}
                          {member.twoFactorEnabled === null
                            ? "Pending"
                            : member.twoFactorEnabled
                              ? "Enabled"
                              : "Disabled"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full">
                          {member.roleLabel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.kind === "invite" ? (
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div>Pending invite</div>
                            {member.permissions?.canSendEmail ? (
                              <div>Can send after acceptance</div>
                            ) : null}
                          </div>
                        ) : member.isEnabled ? (
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div>Active member</div>
                            {member.permissions?.canSendEmail ? (
                              <div>Can send for the organization</div>
                            ) : (
                              <div>Cannot send email with this role</div>
                            )}
                            {member.permissions?.canLaunchCampaigns ? (
                              <div>Can launch campaigns</div>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Disabled
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </SettingsSectionCard>
      </motion.div>

      <LogoUpload
        showLogoUploadModal={logoModal.open}
        setShowLogoUploadModal={(open) =>
          setLogoModal((current) => ({ ...current, open }))
        }
        logoUploadType={logoModal.type}
        onUploaded={async (payload) => {
          if (payload) {
            queryClient.setQueryData(
              ["project-settings", "branding", organizationId],
              normalizeBranding(payload)
            );
          }
          await queryClient.invalidateQueries({
            queryKey: ["project-settings", "branding", organizationId],
          });
        }}
      />
      <InviteUser
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSuccess={async () => {
          await queryClient.invalidateQueries({
            queryKey: ["project-settings", "members", organizationId],
          });
        }}
      />
      <Dialog open={addSenderOpen} onOpenChange={setAddSenderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">
              Add sender identity
            </DialogTitle>
            <DialogDescription>
              Add a sender address or subdomain after your base domain is set up
              and verified.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Sender name</Label>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Support Team"
              />
            </div>
            <div className="space-y-2">
              <Label>Sender email</Label>
              <Input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="support@company.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddSenderOpen(false)}
              disabled={addSenderMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => addSenderMutation.mutate()}
              disabled={
                addSenderMutation.isPending || senderEmail.trim().length === 0
              }
            >
              {addSenderMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MailPlus className="mr-2 h-4 w-4" />
              )}
              Add sender identity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={addDomainOpen} onOpenChange={setAddDomainOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">
              Add domain
            </DialogTitle>
            <DialogDescription>
              Register the root domain you want to send from, then publish the
              DNS records shown for verification.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Domain</Label>
              <Input
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                placeholder="company.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddDomainOpen(false)}
              disabled={addDomainMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => addDomainMutation.mutate()}
              disabled={
                addDomainMutation.isPending || domainName.trim().length === 0
              }
            >
              {addDomainMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Globe2 className="mr-2 h-4 w-4" />
              )}
              Add domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={domainDnsDialog.open}
        onOpenChange={(open) =>
          setDomainDnsDialog((current) => ({ ...current, open }))
        }
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">
              Verify {domainDnsDialog.domain || "domain"}
            </DialogTitle>
            <DialogDescription>
              Add these DNS records at your DNS provider, then recheck the
              domain status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {domainDnsQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        Backend verification state
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        These are the checks the backend still considers true or
                        false in the database.
                      </div>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getSenderStatusTone(
                        domainDnsStatus?.status ?? "pending"
                      )}`}
                    >
                      {(domainDnsStatus?.status ?? "pending")
                        .charAt(0)
                        .toUpperCase() +
                        (domainDnsStatus?.status ?? "pending").slice(1)}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    {(domainDnsStatus?.checks ?? []).map((check) => (
                      <div key={check.key}>
                        {check.passed === null ? (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-current" />
                            {check.label} unknown
                          </span>
                        ) : (
                          statusCell(check.passed)
                        )}
                      </div>
                    ))}
                  </div>
                  {failingDomainChecks.length > 0 ? (
                    <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
                      Still false in database:{" "}
                      {failingDomainChecks
                        .map((check) => check.label)
                        .join(", ")}
                    </div>
                  ) : null}
                </div>

                {domainDnsRecords.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-background/50 p-6 text-sm text-muted-foreground">
                    DNS records are not available yet for this domain.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {domainDnsRecords.map((record) => {
                      const linkedCheck = inferDnsCheckKey(record);
                      const hasExplicitRecordVerification =
                        typeof record.verified === "boolean";
                      const databaseCheck =
                        linkedCheck == null
                          ? null
                          : ((domainDnsStatus?.checks ?? []).find(
                              (check) => check.key === linkedCheck
                            ) ?? null);
                      const recordStatus =
                        record.verified === true
                          ? {
                              label: "Verified",
                              tone: getSenderStatusTone("verified"),
                              helper:
                                "Pass reported directly by the backend for this record.",
                            }
                          : record.verified === false
                            ? {
                                label: "Failed",
                                tone: getSenderStatusTone("failed"),
                                helper:
                                  "Fail reported directly by the backend for this record.",
                              }
                            : databaseCheck?.passed === false
                              ? {
                                  label: "Inferred fail",
                                  tone: getSenderStatusTone("failed"),
                                  helper: `${databaseCheck.label} is still false in backend domain status, but this DNS record itself did not include a direct verification result.`,
                                }
                              : databaseCheck?.passed === true
                                ? {
                                    label: "Inferred pass",
                                    tone: getSenderStatusTone("verified"),
                                    helper: `${databaseCheck.label} is passing in backend domain status, but this DNS record itself did not include a direct verification result.`,
                                  }
                                : {
                                    label: "No backend result",
                                    tone: "bg-muted text-muted-foreground",
                                    helper:
                                      "This record does not include a pass/fail result from the backend yet.",
                                  };

                      return (
                        <div
                          key={record.id}
                          className="rounded-2xl border border-border/60 bg-background/60 p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                              {record.type}
                            </div>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${recordStatus.tone}`}
                            >
                              {recordStatus.label}
                            </span>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Host
                              </div>
                              <code className="mt-1 block break-all rounded-lg bg-muted px-2 py-1 text-xs text-foreground">
                                {record.host}
                              </code>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Value
                              </div>
                              <code className="mt-1 block break-all rounded-lg bg-muted px-2 py-1 text-xs text-foreground">
                                {record.value}
                              </code>
                            </div>
                            {record.ttl || record.priority ? (
                              <div className="text-xs text-muted-foreground">
                                {[
                                  record.ttl ? `TTL ${record.ttl}` : null,
                                  record.priority
                                    ? `Priority ${record.priority}`
                                    : null,
                                ]
                                  .filter(Boolean)
                                  .join(" • ")}
                              </div>
                            ) : null}
                            <div className="text-xs text-muted-foreground">
                              Source:{" "}
                              {hasExplicitRecordVerification
                                ? "backend record result"
                                : databaseCheck
                                  ? "inferred from backend domain status"
                                  : "not provided by backend"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {recordStatus.helper}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setDomainDnsDialog({ open: false, domainId: null, domain: "" })
              }
            >
              Close
            </Button>
            <Button
              variant="outline"
              disabled={
                !domainDnsDialog.domainId ||
                autoConfigureDomainDnsMutation.isPending ||
                !canManageSenderIdentities
              }
              onClick={() => {
                if (!domainDnsDialog.domainId) return;
                autoConfigureDomainDnsMutation.mutate(domainDnsDialog.domainId);
              }}
            >
              {autoConfigureDomainDnsMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Auto-configure DNS
            </Button>
            <Button
              disabled={
                !domainDnsDialog.domainId ||
                recheckDomainMutation.isPending ||
                !canManageSenderIdentities
              }
              onClick={() => {
                if (!domainDnsDialog.domainId) return;
                recheckDomainMutation.mutate(domainDnsDialog.domainId);
              }}
            >
              {recheckDomainMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Recheck domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
