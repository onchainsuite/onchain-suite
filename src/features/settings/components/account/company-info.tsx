import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";

import { fadeInUp, staggerContainer } from "../../utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface CompanyInfoProps {
  saving: boolean;
  handleSave: (callback?: () => void) => void;
}

const CompanyInfo = ({ saving, handleSave }: CompanyInfoProps) => {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [activeOrgIdOverride, setActiveOrgIdOverride] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    website: "",
    status: "unknown",
  });

  useEffect(() => {
    const handler = (e: any) => {
      const orgId = e?.detail?.orgId;
      if (typeof orgId === "string" && orgId.length > 0) {
        setActiveOrgIdOverride(orgId);
      }
    };
    window.addEventListener("onchain:org-changed", handler);
    return () => window.removeEventListener("onchain:org-changed", handler);
  }, []);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const listRes = await apiClient.get("/organization/list");
        const data = listRes.data as any;
        const orgsData = (Array.isArray(data) ? data : data?.data) || [];

        if (Array.isArray(orgsData) && orgsData.length > 0) {
          const activeId =
            activeOrgIdOverride ?? session?.session?.activeOrganizationId ?? null;
          const currentOrg = activeId
            ? orgsData.find((o: any) => o.id === activeId) || orgsData[0]
            : orgsData[0];

          const orgStatus =
            (currentOrg as any).status ||
            (currentOrg as any).metadata?.status ||
            "unknown";

          const orgId = (currentOrg as any)?.id ?? null;
          let website = "";
          let detailedStatus: string | undefined;
          if (orgId) {
            try {
              const orgRes = await apiClient.get("/organization", {
                headers: { "x-org-id": orgId },
              });
              const orgPayload = (orgRes.data as any)?.data ?? orgRes.data;
              website =
                String(
                  orgPayload?.websiteUrl ??
                    orgPayload?.website_url ??
                    orgPayload?.website ??
                    ""
                ) || "";
              detailedStatus =
                orgPayload?.status ?? orgPayload?.metadata?.status ?? undefined;
            } catch {}
          }

          setFormData({
            name: currentOrg.name ?? "",
            slug: currentOrg.slug ?? "",
            website,
            status: String(detailedStatus ?? orgStatus ?? "unknown"),
          });
        }
      } catch (error) {
        console.error("Failed to fetch organization list", error);
      }
    };
    fetchOrg();
  }, [session, activeOrgIdOverride]);

  const onSave = async () => {
    setLoading(true);
    try {
      const activeOrgId = session?.session?.activeOrganizationId;
      if (!activeOrgId) {
        toast.error("No active organization");
        return;
      }

      const response = await fetch("/api/v1/organization", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-org-id": activeOrgId,
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          websiteUrl: formData.website,
        }),
      });

      if (response.ok) {
        toast.success("Organization updated");
      } else {
        throw new Error("Failed to update organization");
      }
    } catch (error) {
      toast.error("Failed to update organization");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "inactive":
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "pending":
      case "trial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const normalizedStatus = String(formData.status ?? "unknown").toLowerCase();
  const isActive =
    normalizedStatus === "active" ||
    normalizedStatus === "paid" ||
    normalizedStatus === "trial";
  const statusLabel = isActive ? "Active" : "Not active";

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-center gap-3">
        <motion.h2
          variants={fadeInUp}
          className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
        >
          Company information
        </motion.h2>
        <motion.span
          variants={fadeInUp}
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
            isActive ? "active" : "inactive"
          )}`}
        >
          {statusLabel}
        </motion.span>
      </div>
      <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
        Your organization details
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 lg:mt-10 lg:pt-10"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Company name
            </Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Website URL
            </Label>
            <Input
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Account slug
            </Label>
            <Input
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block"
        >
          <Button
            onClick={onSave}
            disabled={loading}
            className="mt-8 h-11 bg-primary px-8 text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/10"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save changes
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default CompanyInfo;
