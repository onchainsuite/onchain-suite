"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import BillingSettings from "../components/billing/billing";
import ProfileSettings from "../components/profile/profile";
import RewardsSettings from "../components/rewards/rewards";
import { tabs } from "../utils";
import CompanySettingsView from "./company-settings-view";
import IntegrationsSettings from "../components/integrations/integrations";

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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-5xl px-4 py-2 lg:px-8 lg:py-4">
        {/* Header */}
        <div className="mb-8 space-y-2 lg:mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Settings
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8 overflow-x-auto pb-2 lg:mb-12 lg:pb-0">
          <div className="inline-flex items-center rounded-xl border border-border/50 bg-muted/50 p-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    const next = new URLSearchParams(searchParamsString);
                    next.set("tab", tab.id);
                    router.replace(`/settings?${next.toString()}`);
                  }}
                  className={`relative flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg bg-background shadow-sm ring-1 ring-border/50"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="min-h-100">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && <ProfileSettings key="profile" />}
            {activeTab === "account" && <CompanySettingsView key="account" />}
            {activeTab === "billing" && <BillingSettings key="billing" />}
            {activeTab === "integrations" && (
              <IntegrationsSettings key="integrations" />
            )}
            {activeTab === "rewards" && <RewardsSettings key="rewards" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
