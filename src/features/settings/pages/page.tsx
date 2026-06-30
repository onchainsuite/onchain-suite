"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import BillingSettings from "../components/billing/billing";
import IntegrationsSettings from "../components/integrations/integrations";
import ProfileSettings from "../components/profile/profile";
import RewardsSettings from "../components/rewards/rewards";
import { tabs } from "../utils";
import CompanySettingsView from "./company-settings-view";
import { PageHeader } from "@/shared/components/page/page-header";
import { PageTabs } from "@/shared/components/page/page-tabs";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams?.get("tab") ?? null;
  const searchParamsString = searchParams?.toString() ?? "";

  const tabIds = useMemo(() => new Set(tabs.map((t) => t.id)), []);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (typeof tabFromUrl !== "string") return;
    if (!tabIds.has(tabFromUrl)) return;
    setActiveTab(tabFromUrl);
  }, [tabFromUrl, tabIds]);

  const selectTab = (id: string) => {
    setActiveTab(id);
    const next = new URLSearchParams(searchParamsString);
    next.set("tab", id);
    router.replace(`/settings?${next.toString()}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account, billing, and integrations."
      />

      <PageTabs
        tabs={tabs}
        value={activeTab}
        onValueChange={selectTab}
        layoutId="settings-tabs"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mx-auto w-full max-w-6xl"
        >
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "account" && <CompanySettingsView />}
          {activeTab === "billing" && <BillingSettings />}
          {activeTab === "integrations" && <IntegrationsSettings />}
          {activeTab === "rewards" && <RewardsSettings />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
