"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tabs, modalSlideUp } from "../utils";
import ProfileSettings from "../components/profile/profile";
import AccountSettings from "../components/account/account";
import BillingSettings from "../components/billing/billing";
import IntegrationsSettings from "../components/integrations/integrations";
import RewardsSettings from "../components/rewards/rewards";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

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
                  onClick={() => setActiveTab(tab.id)}
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
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && <ProfileSettings key="profile" />}
            {activeTab === "account" && <AccountSettings key="account" />}
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
