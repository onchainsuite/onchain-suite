import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronRight,
  Globe,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { cn, getSelectedOrganizationId } from "@/lib/utils";

import { fadeInUp, staggerContainer } from "../../utils";
import DnsRecord from "./dns-record";
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

interface SenderVerificationProps {
  refreshTrigger?: number;
}

interface Domain {
  id: string;
  domain: string;
  status?: string;
  verifiedAt?: string;
  verificationRecords?: Record<string, unknown>;
}

interface Sender {
  id: string;
  email: string;
  name: string;
  domain: string;
  dkim: boolean;
  spf: boolean;
  status: "verified" | "pending";
}

interface DNSRecord {
  type: string;
  host: string;
  name?: string;
  value: string;
  token?: string;
  ttl?: number;
  priority?: number;
  status?: string;
  description?: string;
}

interface LiveDNSRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const pickNonEmptyString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return undefined;
};

const getErrorMessage = (error: unknown) => {
  if (!isRecord(error)) return undefined;
  const response = isRecord(error.response) ? error.response : undefined;
  const data = response && isRecord(response.data) ? response.data : undefined;
  const nestedError =
    data && isRecord(data.error)
      ? (data.error as Record<string, unknown>)
      : undefined;

  return pickNonEmptyString(nestedError?.message, data?.message, error.message);
};

const fetchJson = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  let data: unknown = null;
  try {
    data = await res.json();
  } catch (_e) {
    String(_e);
    data = null;
  }
  return { res, data };
};

const postSetActiveOrg = async (orgId: string) => {
  try {
    await fetch("/api/v1/organization/set-active", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: orgId, organization_id: orgId }),
    });
  } catch (_e) {
    String(_e);
  }
};

const extractList = (payload: unknown): unknown[] => {
  const root =
    isRecord(payload) && "data" in payload
      ? (payload.data ?? payload)
      : payload;
  if (Array.isArray(root)) return root;
  if (isRecord(root) && Array.isArray(root.data)) return root.data;
  if (isRecord(root) && Array.isArray(root.items)) return root.items;
  if (isRecord(root) && Array.isArray(root.domains)) return root.domains;
  if (isRecord(root) && Array.isArray(root.records)) return root.records;
  return [];
};

const SenderVerification = ({ refreshTrigger }: SenderVerificationProps) => {
  const { data: session } = authClient.useSession();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [senders, setSenders] = useState<Sender[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedDomains, setExpandedDomains] = useState<
    Record<string, boolean>
  >({});

  // Modal States
  const [showAddDomainModal, setShowAddDomainModal] = useState(false);
  const [showAddSenderModal, setShowAddSenderModal] = useState(false);

  // Selected Item States
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [domainDnsRecords, setDomainDnsRecords] = useState<
    Record<string, DNSRecord[]>
  >({});
  const [liveDnsRecords, setLiveDnsRecords] = useState<
    Record<string, LiveDNSRecord[]>
  >({});
  const [verifyingDomainId, setVerifyingDomainId] = useState<string | null>(
    null
  );
  const [fetchingLiveDns, setFetchingLiveDns] = useState<string | null>(null);

  // Form States
  const [newDomainName, setNewDomainName] = useState("");
  const [newSenderEmail, setNewSenderEmail] = useState("");
  const [newSenderName, setNewSenderName] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    kind: "domain" | "sender";
    id: string;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const resolveOrgId = useCallback((): string | null => {
    return (
      session?.session?.activeOrganizationId ??
      getSelectedOrganizationId() ??
      null
    );
  }, [session?.session?.activeOrganizationId]);

  const fetchDomainsList = useCallback(
    async (orgId: string): Promise<Domain[]> => {
      const { res, data } = await fetchJson("/api/v1/domain", {
        headers: { "x-org-id": orgId },
      });
      if (res.status === 409) {
        await postSetActiveOrg(orgId);
        const retry = await fetchJson("/api/v1/domain", {
          headers: { "x-org-id": orgId },
        });
        if (retry.res.status !== 200) return [];
        const retryList = extractList(retry.data);
        return Array.isArray(retryList) ? (retryList as Domain[]) : [];
      }
      if (res.status !== 200) return [];
      const list = extractList(data);
      return Array.isArray(list) ? (list as Domain[]) : [];
    },
    []
  );

  const fetchData = useCallback(async () => {
    const orgId = resolveOrgId();
    if (!orgId) return;
    setLoading(true);
    try {
      const domainsList = await fetchDomainsList(orgId);
      setDomains(domainsList);

      // Fetch Senders
      const sendersRes = await apiClient.get("/sender-identities", {
        headers: { "x-org-id": orgId },
      });
      if (sendersRes.status === 200) {
        const list = extractList(sendersRes.data);
        setSenders(Array.isArray(list) ? (list as Sender[]) : []);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch data", error);
      const errorMessage =
        getErrorMessage(error) ?? "Failed to load domains and senders";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchDomainsList, resolveOrgId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const normalizeDomainName = (raw: string): string => {
    let value = String(raw ?? "")
      .trim()
      .toLowerCase();
    value = value.replace(/^https?:\/\//, "");
    value = value.split("/")[0] ?? value;
    value = value.replace(/\s+/g, "");
    return value;
  };

  const handleAddDomain = async () => {
    const orgId = resolveOrgId();
    if (!orgId) {
      toast.error("Please select an organization first");
      return;
    }
    if (!newDomainName) {
      toast.error("Please enter a valid domain name (e.g., example.com)");
      return;
    }

    const domainName = normalizeDomainName(newDomainName);
    if (!domainName) {
      toast.error("Please enter a valid domain name (e.g., example.com)");
      return;
    }

    // Simple domain regex validation
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domainName)) {
      toast.error("Please enter a valid domain name (e.g., example.com)");
      return;
    }

    setActionLoading(true);
    try {
      const doCreate = async () => {
        return fetchJson("/api/v1/domain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-org-id": orgId,
          },
          body: JSON.stringify({ domain: domainName }),
        });
      };

      let created = await doCreate();
      if (created.res.status === 409) {
        await postSetActiveOrg(orgId);
        created = await doCreate();
      }

      if (created.res.status === 200 || created.res.status === 201) {
        const newDomain = created.data;
        const domainData =
          isRecord(newDomain) && isRecord(newDomain.data)
            ? newDomain.data
            : newDomain;
        const createdDomainId = isRecord(domainData)
          ? String(domainData.id ?? "")
          : "";
        const createdDomainName = isRecord(domainData)
          ? String(domainData.domain ?? domainName)
          : domainName;

        toast.success("Domain added");
        setShowAddDomainModal(false);
        setNewDomainName("");

        await fetchData();
        if (createdDomainId && createdDomainName) {
          setExpandedDomains((prev) => ({ ...prev, [createdDomainId]: true }));
          handleOpenVerifyModal(
            {
              id: createdDomainId,
              domain: createdDomainName,
              status: "pending",
            },
            true
          );
        }
      } else if (created.res.status === 409) {
        const domainsList = await fetchDomainsList(orgId);
        setDomains(domainsList);
        const existing = domainsList.find(
          (d) => normalizeDomainName(d.domain) === domainName
        );
        if (existing) {
          setExpandedDomains((prev) => ({ ...prev, [existing.id]: true }));
          handleOpenVerifyModal(existing, true);
          toast.success("Domain already registered");
          return;
        }

        const message =
          getErrorMessage(created.data) ??
          "Domain is already registered in a different organization or the organization context is not ready.";
        toast.error(message);
      } else {
        toast.error("Failed to add domain");
      }
    } catch (error: unknown) {
      console.error("Add domain error:", error);
      toast.error(getErrorMessage(error) ?? "Failed to add domain");
    } finally {
      setActionLoading(false);
    }
  };

  const fetchLiveDNS = async (domainName: string, domainId: string) => {
    setFetchingLiveDns(domainId);
    try {
      const response = await fetch(`/api/v1/dns/records?domain=${domainName}`);
      const result = await response.json();
      if (result.success) {
        setLiveDnsRecords((prev) => ({
          ...prev,
          [domainId]: result.data.records,
        }));
      }
    } catch (error) {
      console.error("Live DNS fetch error:", error);
    } finally {
      setFetchingLiveDns(null);
    }
  };

  const handleOpenVerifyModal = async (domain: Domain, _expandOnly = false) => {
    setSelectedDomain(domain);

    const orgId = resolveOrgId();
    if (!orgId) return;

    // Use verificationRecords from the domain object if available (Prisma DB)
    if (domain.verificationRecords) {
      const vRecords = domain.verificationRecords;
      const records: DNSRecord[] = [];

      if (typeof vRecords === "object" && !Array.isArray(vRecords)) {
        Object.entries(vRecords).forEach(([key, val]: [string, unknown]) => {
          const v = isRecord(val) ? val : undefined;
          if (v && typeof v.type === "string") {
            records.push({
              type: v.type,
              host:
                (typeof v.name === "string" ? v.name : undefined) ??
                (typeof v.host === "string" ? v.host : undefined) ??
                (key === "domain" ? "@" : key),
              value:
                (typeof v.value === "string" ? v.value : undefined) ??
                (typeof v.token === "string" ? v.token : undefined) ??
                "",
              ttl: typeof v.ttl === "number" ? v.ttl : undefined,
              status: "Required",
              description:
                key === "spf"
                  ? "SPF Record"
                  : key.startsWith("dkim")
                    ? "DKIM Verification"
                    : key === "domain"
                      ? "Domain Ownership Verification"
                      : "",
            });
          }
        });

        if (records.length > 0) {
          setDomainDnsRecords((prev) => ({ ...prev, [domain.id]: records }));
          // Fetch live DNS as well
          fetchLiveDNS(domain.domain, domain.id);
          return;
        }
      }
    }

    try {
      let { res, data } = await fetchJson(`/api/v1/domain/${domain.id}/dns`, {
        headers: { "x-org-id": orgId },
      });
      if (res.status === 409) {
        await postSetActiveOrg(orgId);
        const retry = await fetchJson(`/api/v1/domain/${domain.id}/dns`, {
          headers: { "x-org-id": orgId },
        });
        ({ res, data } = retry);
      }

      if (res.status === 200) {
        let records: DNSRecord[] = [];

        if (isRecord(data) && "data" in data) {
          const payload = data.data;
          if (isRecord(payload) && Array.isArray(payload.records)) {
            records = [...(payload.records as DNSRecord[])];
          } else if (Array.isArray(payload)) {
            records = [...(payload as DNSRecord[])];
          } else if (isRecord(payload)) {
            // Handle object-based records (e.g., { "spf": {...}, "dkim": {...} })
            Object.values(payload).forEach((val: unknown) => {
              const v = isRecord(val) ? val : undefined;
              if (v && typeof v.type === "string" && (v.value ?? v.token)) {
                records.push({
                  type: v.type,
                  host:
                    (typeof v.host === "string" ? v.host : undefined) ??
                    (typeof v.name === "string" ? v.name : undefined) ??
                    "@",
                  value:
                    (typeof v.value === "string" ? v.value : undefined) ??
                    (typeof v.token === "string" ? v.token : undefined) ??
                    "",
                  ttl: typeof v.ttl === "number" ? v.ttl : undefined,
                  priority:
                    typeof v.priority === "number" ? v.priority : undefined,
                  status:
                    (typeof v.status === "string" ? v.status : undefined) ??
                    "Required",
                  description:
                    typeof v.description === "string" ? v.description : "",
                });
              }
            });
          }

          // Also handle dkimTokens if present and not already in records
          if (isRecord(payload) && Array.isArray(payload.dkimTokens)) {
            payload.dkimTokens.forEach((token, idx) => {
              if (typeof token !== "string") return;
              const isAlreadyPresent = records.some((r) => r.value === token);
              if (!isAlreadyPresent) {
                records.push({
                  type: "CNAME",
                  host: `selector${idx + 1}._domainkey`,
                  value: token,
                  status: "Required",
                  description: "DKIM Verification Token",
                });
              }
            });
          }
        } else if (Array.isArray(data)) {
          records = data as DNSRecord[];
        }

        setDomainDnsRecords((prev) => ({ ...prev, [domain.id]: records }));
      }

      // Also fetch live DNS records for comparison
      fetchLiveDNS(domain.domain, domain.id);
    } catch (error: unknown) {
      console.error("DNS fetch error:", error);
      const errorMessage =
        getErrorMessage(error) ?? "Failed to load DNS records";
      toast.error(errorMessage);
    }
  };

  const handleCheckVerifyStatus = async (domain: Domain) => {
    const orgId = resolveOrgId();
    if (!orgId) {
      toast.error("Please select an organization first");
      return;
    }
    setSelectedDomain(domain);
    setVerifyingDomainId(domain.id);
    try {
      // Manual refresh of status as per user instructions
      const response = await apiClient.post(
        `/domain/${domain.id}/recheck`,
        {},
        {
          headers: { "x-org-id": orgId },
        }
      );

      if (response.status === 200) {
        const result = response.data;
        const status = result.status ?? result.data?.status;

        // After recheck, refresh DNS records as they might have been updated in Neon
        handleOpenVerifyModal(domain, true);

        if (status === "verified") {
          toast.success("Domain verified successfully!");
          // Update local state
          setDomains(
            domains.map((d) =>
              d.id === domain.id ? { ...d, status: "verified" } : d
            )
          );
        } else {
          toast.warning("Verification pending. Please check your DNS records.");
        }
      } else {
        toast.error("Verification check failed");
      }
    } catch (error: unknown) {
      console.error("Verification error:", error);
      const errorMessage =
        getErrorMessage(error) ?? "Verification check failed";
      toast.error(errorMessage);
    } finally {
      setVerifyingDomainId(null);
    }
  };

  // Automatic setup is not yet ready on the backend
  /*
  const handleAutoSetup = async () => {
    if (!selectedDomain || !session?.session?.activeOrganizationId) return;
    setActionLoading(true);
    try {
      const response = await apiClient.post(
        `/domain/${selectedDomain.id}/dns/auto`,
        {
          provider: autoDNSProvider,
          credentials: { apiKey: autoDNSApiKey, apiSecret: autoDNSApiSecret },
        },
        {
          headers: {
            "x-org-id": session.session.activeOrganizationId,
          },
        }
      );

      if (response.status === 200) {
        toast.success("DNS records added automatically");
        setShowAutoDNSModal(false);
        // Re-check verification after a delay
        setTimeout(handleCheckVerifyStatus, 5000);
      } else {
        toast.error("Failed to configure DNS automatically");
      }
    } catch (error: any) {
      console.error("Auto setup error:", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to configure DNS automatically";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };
  */

  const handleAddSender = async () => {
    const orgId = resolveOrgId();
    if (!selectedDomain || !orgId || !newSenderEmail) return;
    setActionLoading(true);
    try {
      const fullEmail = `${newSenderEmail}@${selectedDomain.domain}`;
      const response = await apiClient.post(
        `/sender-identities`,
        {
          email: fullEmail,
          name: newSenderName,
          domainId: selectedDomain.id,
        },
        {
          headers: {
            "x-org-id": orgId,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Sender added");
        fetchData(); // Refresh list
        setShowAddSenderModal(false);
        setNewSenderEmail("");
        setNewSenderName("");
      } else {
        toast.error("Failed to add sender");
      }
    } catch (error: unknown) {
      console.error("Add sender error:", error);
      const errorMessage = getErrorMessage(error) ?? "Failed to add sender";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDomain = async (id: string) => {
    const orgId = resolveOrgId();
    if (!orgId) {
      toast.error("Please select an organization first");
      return;
    }

    try {
      const response = await apiClient.delete(`/domain/${id}`, {
        headers: { "x-org-id": orgId },
      });
      if (response.status === 200) {
        toast.success("Domain deleted");
        setDomains(domains.filter((d) => d.id !== id));
      } else {
        toast.error("Failed to delete domain");
      }
    } catch (error: unknown) {
      console.error("Delete domain error:", error);
      const errorMessage = getErrorMessage(error) ?? "Failed to delete domain";
      toast.error(errorMessage);
    }
  };

  const handleRemoveSender = async (id: string) => {
    const orgId = resolveOrgId();
    if (!orgId) {
      toast.error("Please select an organization first");
      return;
    }

    try {
      const response = await apiClient.delete(`/sender-identities/${id}`, {
        headers: { "x-org-id": orgId },
      });
      if (response.status === 200) {
        toast.success("Sender removed");
        setSenders(senders.filter((s) => s.id !== id));
      } else {
        toast.error("Failed to remove sender");
      }
    } catch (error: unknown) {
      console.error("Remove sender error:", error);
      const errorMessage = getErrorMessage(error) ?? "Failed to remove sender";
      toast.error(errorMessage);
    }
  };

  const toggleExpand = (domainId: string) => {
    setExpandedDomains((prev) => ({ ...prev, [domainId]: !prev[domainId] }));
  };

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <motion.h2
            variants={fadeInUp}
            className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
          >
            Domain Verification
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
            Manage custom domains and verify DNS infrastructure
          </motion.p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => setShowAddDomainModal(true)}
            className="h-11 bg-primary px-6 text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Button>
        </motion.div>
      </div>

      <motion.div variants={fadeInUp} className="mt-8 space-y-4">
        {loading && domains.length === 0 && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && domains.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <Globe className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No domains added</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a custom domain to start sending branded emails.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowAddDomainModal(true)}
            >
              Add Domain
            </Button>
          </div>
        )}

        {domains.map((domain, idx) => {
          const domainSenders = senders.filter(
            (s) =>
              s.domain === domain.domain ||
              s.email.endsWith(`@${domain.domain}`)
          );
          const status = String(domain.status ?? "").toLowerCase();
          const isVerified =
            status === "verified" || status === "active" || !!domain.verifiedAt;
          const isExpanded = expandedDomains[domain.id];

          return (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300"
            >
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      isVerified
                        ? "bg-primary/10 text-primary"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30"
                    )}
                  >
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                      {domain.domain}
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          <Check className="h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                          <AlertCircle className="h-3 w-3" /> Pending
                          Verification
                        </span>
                      )}
                    </h3>
                    {isVerified && (
                      <p className="text-sm text-muted-foreground">
                        {domainSenders.length} active sender
                        {domainSenders.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (!isVerified && !isExpanded) {
                        handleOpenVerifyModal(domain, true); // true means expand instead of modal
                      }
                      toggleExpand(domain.id);
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  {/* {!isVerified && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenVerifyModal(domain)}
                      className="gap-2"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Verify
                    </Button>
                  )} */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() =>
                      setConfirmDialog({ kind: "domain", id: domain.id })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded Content: Senders (if verified) or DNS Records (if pending) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border/60 bg-muted/30 px-6 py-4"
                  >
                    {isVerified ? (
                      <>
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="mb-4 flex items-center justify-between">
                              <h4 className="text-sm font-medium text-muted-foreground">
                                Sender Identities
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-2"
                                onClick={() => {
                                  setSelectedDomain(domain);
                                  setShowAddSenderModal(true);
                                }}
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add Sender
                              </Button>
                            </div>

                            <div className="space-y-2">
                              {domainSenders.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">
                                  No senders created for this domain.
                                </p>
                              )}
                              {domainSenders.map((sender) => (
                                <div
                                  key={sender.id}
                                  className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                      <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-foreground">
                                        {sender.email}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {sender.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                      Verified
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                      onClick={() =>
                                        setConfirmDialog({
                                          kind: "sender",
                                          id: sender.id,
                                        })
                                      }
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="mb-4 flex items-center justify-between">
                              <h4 className="text-sm font-medium text-muted-foreground">
                                Live DNS Status
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-2"
                                onClick={() =>
                                  fetchLiveDNS(domain.domain, domain.id)
                                }
                                disabled={fetchingLiveDns === domain.id}
                              >
                                {fetchingLiveDns === domain.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <RefreshCw className="h-3.5 w-3.5" />
                                )}
                                Refresh
                              </Button>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {!liveDnsRecords[domain.id] ? (
                                <p className="text-sm text-muted-foreground italic">
                                  Click refresh to fetch live DNS data.
                                </p>
                              ) : liveDnsRecords[domain.id].length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">
                                  No public DNS records found.
                                </p>
                              ) : (
                                liveDnsRecords[domain.id].map((record) => (
                                  <div
                                    key={`${record.type}-${record.name}-${record.value}-${record.ttl}-${record.priority ?? ""}`}
                                    className="rounded-lg border border-border bg-background p-2.5 text-xs"
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-bold text-primary uppercase">
                                        {record.type}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">
                                        TTL: {record.ttl}s
                                      </span>
                                    </div>
                                    <div className="break-all font-mono text-muted-foreground bg-muted/30 p-1.5 rounded mt-1 border border-border/30">
                                      {record.priority !== undefined && (
                                        <span className="text-blue-500 mr-1">
                                          [{record.priority}]
                                        </span>
                                      )}
                                      {record.value}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Required DNS Records
                            </h4>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-2"
                              onClick={() => handleCheckVerifyStatus(domain)}
                              disabled={verifyingDomainId === domain.id}
                            >
                              {verifyingDomainId === domain.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                              )}
                              Check Status
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {!Array.isArray(domainDnsRecords[domain.id]) ? (
                              <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Fetching records...
                              </div>
                            ) : domainDnsRecords[domain.id].length === 0 ? (
                              <p className="text-sm text-muted-foreground italic">
                                No required DNS records found in database.
                              </p>
                            ) : (
                              domainDnsRecords[domain.id].map((record) => (
                                <DnsRecord
                                  key={`${record.type}-${record.host}-${record.value}`}
                                  record={record}
                                />
                              ))
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Live DNS Status
                            </h4>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-2"
                              onClick={() =>
                                fetchLiveDNS(domain.domain, domain.id)
                              }
                              disabled={fetchingLiveDns === domain.id}
                            >
                              {fetchingLiveDns === domain.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                              )}
                              Refresh
                            </Button>
                          </div>

                          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {!liveDnsRecords[domain.id] ? (
                              <p className="text-sm text-muted-foreground italic">
                                Click refresh to fetch live DNS data.
                              </p>
                            ) : liveDnsRecords[domain.id].length === 0 ? (
                              <p className="text-sm text-muted-foreground italic">
                                No public DNS records found.
                              </p>
                            ) : (
                              liveDnsRecords[domain.id].map((record) => (
                                <div
                                  key={`${record.type}-${record.name}-${record.value}-${record.ttl}-${record.priority ?? ""}`}
                                  className="rounded-lg border border-border bg-background p-2.5 text-xs"
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-primary uppercase">
                                      {record.type}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">
                                      TTL: {record.ttl}s
                                    </span>
                                  </div>
                                  <div className="break-all font-mono text-muted-foreground bg-muted/30 p-1.5 rounded mt-1 border border-border/30">
                                    {record.priority !== undefined && (
                                      <span className="text-blue-500 mr-1">
                                        [{record.priority}]
                                      </span>
                                    )}
                                    {record.value}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* --- Modals --- */}

      {/* 1. Add Domain Modal */}
      <Dialog open={showAddDomainModal} onOpenChange={setShowAddDomainModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Domain</DialogTitle>
            <DialogDescription>
              Enter the domain you want to use for sending emails.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Domain Name</Label>
              <Input
                placeholder="example.com"
                value={newDomainName}
                onChange={(e) => setNewDomainName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddDomain();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDomainModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddDomain}
              disabled={!newDomainName || actionLoading}
            >
              {actionLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Verify Domain Modal - Removed totally for now */}
      {/*
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        ...
      </Dialog>
      */}

      {/* 3. Auto DNS Modal - Commented out as backend is not ready */}
      {/*
      <Dialog open={showAutoDNSModal} onOpenChange={setShowAutoDNSModal}>
        ...
      </Dialog>
      */}

      {/* 4. Add Sender Modal */}
      <Dialog open={showAddSenderModal} onOpenChange={setShowAddSenderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Sender Identity</DialogTitle>
            <DialogDescription>
              Create a new sender email address for {selectedDomain?.domain}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="info"
                  value={newSenderEmail}
                  onChange={(e) => setNewSenderEmail(e.target.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">
                  @ {selectedDomain?.domain}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Display Name (Optional)</Label>
              <Input
                placeholder="Info Team"
                value={newSenderName}
                onChange={(e) => setNewSenderName(e.target.value)}
              />
            </div>
            {newSenderEmail && (
              <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                Preview:{" "}
                {newSenderName.trim().length > 0 ? newSenderName : "..."} &lt;
                {newSenderEmail}@{selectedDomain?.domain}&gt;
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddSenderModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSender}
              disabled={!newSenderEmail || actionLoading}
            >
              {actionLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Sender
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDialog !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDialog(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog?.kind === "domain"
                ? "Delete domain?"
                : "Delete sender?"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog?.kind === "domain"
                ? "This will remove the domain and its related configuration."
                : "This will remove the sender identity."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(null)}
              disabled={confirmLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={confirmLoading}
              onClick={async () => {
                if (!confirmDialog) return;
                setConfirmLoading(true);
                try {
                  if (confirmDialog.kind === "domain") {
                    await handleDeleteDomain(confirmDialog.id);
                  } else {
                    await handleRemoveSender(confirmDialog.id);
                  }
                } finally {
                  setConfirmLoading(false);
                  setConfirmDialog(null);
                }
              }}
            >
              {confirmLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
};

export default SenderVerification;
