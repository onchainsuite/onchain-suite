import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Globe,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Wand2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
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
import { fadeInUp, staggerContainer } from "../../utils";

interface SenderVerificationProps {
  refreshTrigger?: number;
}

import DnsRecord from "./dns-record";

interface Domain {
  id: string;
  domain: string;
  status: "verified" | "pending" | "failed";
  verifiedAt?: string;
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
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAutoDNSModal, setShowAutoDNSModal] = useState(false);
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
  const [autoDNSProvider, setAutoDNSProvider] = useState("godaddy");
  const [autoDNSApiKey, setAutoDNSApiKey] = useState("");
  const [autoDNSApiSecret, setAutoDNSApiSecret] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    if (!session?.session?.activeOrganizationId) return;
    setLoading(true);
    try {
      const orgId = session.session.activeOrganizationId;

      // Fetch Domains
      const domainsRes = await apiClient.get("/domain", {
        headers: { "x-org-id": orgId },
      });
      if (domainsRes.status === 200) {
        const data = domainsRes.data;
        const list = data.data || (Array.isArray(data) ? data : []);
        setDomains(Array.isArray(list) ? list : []);
      }

      // Fetch Senders
      const sendersRes = await apiClient.get("/sender-identities", {
        headers: { "x-org-id": orgId },
      });
      if (sendersRes.status === 200) {
        const data = sendersRes.data;
        const list = data.data || (Array.isArray(data) ? data : []);
        setSenders(Array.isArray(list) ? list : []);
      }
    } catch (error: any) {
      console.error("Failed to fetch data", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to load domains and senders";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session, refreshTrigger]);

  const handleAddDomain = async () => {
    if (!session?.session?.activeOrganizationId || !newDomainName) return;

    // Simple domain regex validation
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(newDomainName)) {
      toast.error("Please enter a valid domain name (e.g., example.com)");
      return;
    }

    setActionLoading(true);
    try {
      const response = await apiClient.post(
        "/domain",
        { domain: newDomainName },
        {
          headers: {
            "x-org-id": session.session.activeOrganizationId,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const newDomain = response.data;
        // Handle wrapped response
        const domainData = newDomain.data || newDomain;

        toast.success("Domain added");
        setDomains([...domains, domainData]);
        setShowAddDomainModal(false);
        setNewDomainName("");

        // Open verify modal immediately
        handleOpenVerifyModal(domainData);
      } else {
        toast.error("Failed to add domain");
      }
    } catch (error: any) {
      console.error("Add domain error:", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to add domain";
      toast.error(errorMessage);
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

  const handleOpenVerifyModal = async (domain: Domain, expandOnly = false) => {
    setSelectedDomain(domain);
    if (!expandOnly) {
      setShowVerifyModal(true);
    }

    if (!session?.session?.activeOrganizationId) return;

    // Use verificationRecords from the domain object if available (Prisma DB)
    if ((domain as any).verificationRecords) {
      const vRecords = (domain as any).verificationRecords;
      let records: DNSRecord[] = [];

      if (typeof vRecords === "object" && !Array.isArray(vRecords)) {
        Object.entries(vRecords).forEach(([key, val]: [string, any]) => {
          if (val && typeof val === "object" && val.type) {
            records.push({
              type: val.type,
              host: val.name || val.host || (key === "domain" ? "@" : key),
              value: val.value || val.token || "",
              ttl: val.ttl,
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
          console.log(
            `Using records from Domain object for ${domain.id}:`,
            records
          );
          setDomainDnsRecords((prev) => ({ ...prev, [domain.id]: records }));
          // Fetch live DNS as well
          fetchLiveDNS(domain.domain, domain.id);
          return;
        }
      }
    }

    try {
      const response = await apiClient.get(`/domain/${domain.id}/dns`, {
        headers: { "x-org-id": session.session.activeOrganizationId },
      });

      if (response.status === 200) {
        const data = response.data;
        let records: DNSRecord[] = [];

        if (data.data) {
          if (Array.isArray(data.data.records)) {
            records = [...data.data.records];
          } else if (Array.isArray(data.data)) {
            records = [...data.data];
          } else if (typeof data.data === "object") {
            // Handle object-based records (e.g., { "spf": {...}, "dkim": {...} })
            Object.values(data.data).forEach((val: any) => {
              if (
                val &&
                typeof val === "object" &&
                val.type &&
                (val.value || val.token)
              ) {
                records.push({
                  type: val.type,
                  host: val.host || val.name || "@",
                  value: val.value || val.token || "",
                  ttl: val.ttl,
                  priority: val.priority,
                  status: val.status || "Required",
                  description: val.description || "",
                });
              }
            });
          }

          // Also handle dkimTokens if present and not already in records
          if (Array.isArray(data.data.dkimTokens)) {
            data.data.dkimTokens.forEach((token: string, idx: number) => {
              const isAlreadyPresent = records.some(
                (r) => r.value === token || (r as any).token === token
              );
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
          records = data;
        }

        setDomainDnsRecords((prev) => ({ ...prev, [domain.id]: records }));
      }

      // Also fetch live DNS records for comparison
      fetchLiveDNS(domain.domain, domain.id);
    } catch (error: any) {
      console.error("DNS fetch error:", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to load DNS records";
      toast.error(errorMessage);
    }
  };

  const handleCheckVerifyStatus = async () => {
    if (!selectedDomain || !session?.session?.activeOrganizationId) return;
    setVerifyingDomainId(selectedDomain.id);
    try {
      // Manual refresh of status as per user instructions
      const response = await apiClient.post(
        `/domain/${selectedDomain.id}/recheck`,
        {},
        {
          headers: { "x-org-id": session.session.activeOrganizationId },
        }
      );

      if (response.status === 200) {
        const result = response.data;
        const status = result.status || result.data?.status;

        // After recheck, refresh DNS records as they might have been updated in Neon
        handleOpenVerifyModal(selectedDomain, true);

        if (status === "verified") {
          toast.success("Domain verified successfully!");
          setShowVerifyModal(false);
          // Update local state
          setDomains(
            domains.map((d) =>
              d.id === selectedDomain.id ? { ...d, status: "verified" } : d
            )
          );
        } else {
          toast.warning("Verification pending. Please check your DNS records.");
        }
      } else {
        toast.error("Verification check failed");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Verification check failed";
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
    if (
      !selectedDomain ||
      !session?.session?.activeOrganizationId ||
      !newSenderEmail
    )
      return;
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
            "x-org-id": session.session.activeOrganizationId,
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
    } catch (error: any) {
      console.error("Add sender error:", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to add sender";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDomain = async (id: string) => {
    if (!session?.session?.activeOrganizationId) return;
    if (!confirm("Are you sure you want to delete this domain?")) return;

    try {
      const response = await apiClient.delete(`/domain/${id}`, {
        headers: { "x-org-id": session.session.activeOrganizationId },
      });
      if (response.status === 200) {
        toast.success("Domain deleted");
        setDomains(domains.filter((d) => d.id !== id));
      } else {
        toast.error("Failed to delete domain");
      }
    } catch (error: any) {
      console.error("Delete domain error:", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to delete domain";
      toast.error(errorMessage);
    }
  };

  const handleRemoveSender = async (id: string) => {
    if (!session?.session?.activeOrganizationId) return;
    if (!confirm("Are you sure you want to delete this sender?")) return;

    try {
      const response = await apiClient.delete(`/sender-identities/${id}`, {
        headers: { "x-org-id": session.session.activeOrganizationId },
      });
      if (response.status === 200) {
        toast.success("Sender removed");
        setSenders(senders.filter((s) => s.id !== id));
      } else {
        toast.error("Failed to remove sender");
      }
    } catch (error: any) {
      console.error("Remove sender error:", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to remove sender";
      toast.error(errorMessage);
    }
  };

  const toggleExpand = (domainId: string) => {
    setExpandedDomains((prev) => ({ ...prev, [domainId]: !prev[domainId] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
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
          const isVerified = domain.status === "verified";
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
                    onClick={() => handleDeleteDomain(domain.id)}
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
                                        handleRemoveSender(sender.id)
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
                                liveDnsRecords[domain.id].map((record, i) => (
                                  <div
                                    key={i}
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
                              onClick={() => handleCheckVerifyStatus()}
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
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
                              domainDnsRecords[domain.id].map((record, i) => (
                                <DnsRecord key={i} record={record} />
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
                              liveDnsRecords[domain.id].map((record, i) => (
                                <div
                                  key={i}
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
                Preview: "{newSenderName || "..."}" &lt;{newSenderEmail}@
                {selectedDomain?.domain}&gt;
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
    </motion.section>
  );
};

export default SenderVerification;
