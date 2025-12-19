"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  initialAutomationsData,
  draftsData,
  templatesData,
} from "@/features/automation/data";
import { Automation, Draft, Template } from "@/features/automation/types";

// Components
import { ActiveAutomationsList } from "./active";
import { DraftsList } from "./drafts-list";
import { TemplatesList } from "./templates-list";
import { AutomationStats } from "./stats";
import { AutomationTabs } from "./tabs";
import { DeleteModal } from "./delete-modal";
import { Toast } from "./toast";

export const AutomationList = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [automations, setAutomations] = useState<Automation[]>(
    initialAutomationsData as unknown as Automation[]
  );
  const [drafts, setDrafts] = useState<Draft[]>(
    draftsData as unknown as Draft[]
  );
  const [templates] = useState<Template[]>(
    templatesData as unknown as Template[]
  );
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    automation: Automation | null;
  }>({ show: false, automation: null });
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredAutomations = automations.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    active: automations.filter((a) => a.status === "active").length,
    totalEntries: automations.reduce((sum, a) => sum + a.entries, 0),
    totalConversions: automations.reduce((sum, a) => sum + a.conversions, 0),
    totalRevenue: automations.reduce((sum, a) => sum + a.revenue, 0),
  };

  const handleDuplicate = (automation: Automation) => {
    const newDraft: Draft = {
      id: `d${Date.now()}`,
      name: `${automation.name} - copy`,
      description: automation.description,
      trigger: automation.trigger,
      lastEdited: "Just now",
    };
    setDrafts([newDraft, ...drafts]);
    setActiveTab("drafts");
    setToast({
      show: true,
      message: `Duplicated "${automation.name}"`,
      type: "success",
    });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    if (deleteModal.automation) {
      setIsDeleting(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setAutomations(
        automations.filter((a) => a.id !== deleteModal.automation?.id)
      );
      setDrafts(drafts.filter((d) => d.id !== deleteModal.automation?.id));
      setIsDeleting(false);
      setToast({
        show: true,
        message: `Deleted "${deleteModal.automation.name}"`,
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
    }
    setDeleteModal({ show: false, automation: null });
  };

  const handleToggleStatus = (automation: Automation) => {
    setAutomations(
      automations.map((a) =>
        a.id === automation.id
          ? { ...a, status: a.status === "active" ? "paused" : "active" }
          : a
      )
    );
    setToast({
      show: true,
      message: `${automation.name} ${
        automation.status === "active" ? "paused" : "resumed"
      }`,
      type: "success",
    });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex min-h-screen bg-background"
    >
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Automations
              </h1>
              <p className="mt-1 text-muted-foreground">
                Trigger personalized flows based on your users' on-chain and
                behavioral signals
              </p>
            </div>
            <Link
              href="/automations/new-id"
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Create automation
            </Link>
          </div>

          <AutomationStats stats={stats} />

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <AutomationTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              counts={{
                active: stats.active,
                drafts: drafts.length,
              }}
            />

            <TabsContent value="active" className="space-y-4">
              <ActiveAutomationsList
                automations={filteredAutomations}
                searchQuery={searchQuery}
                onToggleStatus={handleToggleStatus}
                onDuplicate={handleDuplicate}
                onDelete={(automation) =>
                  setDeleteModal({ show: true, automation })
                }
              />
            </TabsContent>

            <TabsContent value="drafts" className="space-y-4">
              <DraftsList drafts={drafts} />
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <TemplatesList templates={templates} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <DeleteModal
        show={deleteModal.show}
        automation={deleteModal.automation}
        isDeleting={isDeleting}
        onClose={() => setDeleteModal({ show: false, automation: null })}
        onConfirm={handleDelete}
      />

      <Toast
        show={!!toast}
        message={toast?.message || ""}
        type={toast?.type || "success"}
        onClose={() => setToast(null)}
      />
    </motion.div>
  );
};
