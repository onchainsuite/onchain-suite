"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { apiClient } from "@/lib/api-client";
import { isJsonObject } from "@/lib/utils";

import { fadeInUp } from "../../utils";
import InviteUser from "../invite-user";
import LogoUpload from "../logo-upload";
import Branding from "./branding";
import CompanyInfo from "./company-info";
import SenderVerification from "./sender-verification";
import TeamMembers from "./team-members";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export default function AccountSettings() {
  const [showLogoUploadModal, setShowLogoUploadModal] = useState(false);
  const [logoUploadType, setLogoUploadType] = useState<
    "primary" | "dark" | "favicon"
  >("primary");
  const [showInviteUserModal, setShowInviteUserModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const queryClient = useQueryClient();
  const hasInitializedSmartSending = useRef(false);
  const [smartSendingEnabled, setSmartSendingEnabled] = useState(true);
  const [cooldownHours, setCooldownHours] = useState("10");
  const [smartSendingError, setSmartSendingError] = useState<string | null>(
    null
  );

  const triggerUpdate = () => setRefreshTrigger((prev) => prev + 1);

  const openLogoUpload = (type: "primary" | "dark" | "favicon") => {
    setLogoUploadType(type);
    setShowLogoUploadModal(true);
  };

  const handleSave = async (callback?: () => void) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    callback?.();
  };

  const orgSettingsQuery = useQuery({
    queryKey: ["organization", "settings"],
    queryFn: async () => {
      const res = await apiClient.get("/organization");
      const payload: unknown = res.data?.data ?? res.data;
      const orgObj = isJsonObject(payload) ? payload : {};
      const settings = isJsonObject(orgObj.settings) ? orgObj.settings : {};
      return settings;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const smartSendingDefaults = useMemo(
    () => ({
      enabled: true,
      cooldownHours: 10,
    }),
    []
  );

  useEffect(() => {
    if (!orgSettingsQuery.isSuccess) return;
    if (hasInitializedSmartSending.current) return;
    const settings = orgSettingsQuery.data;
    const enabledRaw =
      isJsonObject(settings) && "smartSendingEnabled" in settings
        ? settings.smartSendingEnabled
        : undefined;
    const cooldownRaw =
      isJsonObject(settings) && "smartSendingCooldownHours" in settings
        ? settings.smartSendingCooldownHours
        : undefined;

    setSmartSendingEnabled(
      typeof enabledRaw === "boolean"
        ? enabledRaw
        : smartSendingDefaults.enabled
    );
    setCooldownHours(
      typeof cooldownRaw === "number" && Number.isFinite(cooldownRaw)
        ? String(cooldownRaw)
        : String(smartSendingDefaults.cooldownHours)
    );
    hasInitializedSmartSending.current = true;
  }, [orgSettingsQuery.data, orgSettingsQuery.isSuccess, smartSendingDefaults]);

  const saveSmartSendingMutation = useMutation({
    mutationFn: async (next: { enabled: boolean; cooldownHours: number }) => {
      const base = orgSettingsQuery.data;
      const baseSettings = isJsonObject(base) ? base : {};
      await apiClient.put("/organization", {
        settings: {
          ...baseSettings,
          smartSendingEnabled: next.enabled,
          smartSendingCooldownHours: next.cooldownHours,
        },
      });
    },
    onSuccess: async () => {
      toast.success("Smart Sending settings updated");
      setSmartSendingError(null);
      await queryClient.invalidateQueries({
        queryKey: ["organization", "settings"],
      });
    },
    onError: (e: unknown) => {
      const message =
        e instanceof Error
          ? e.message
          : "Failed to update Smart Sending settings";
      toast.error(message);
    },
  });

  const onSaveSmartSending = () => {
    const parsed = Number(cooldownHours);
    if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
      setSmartSendingError("Cooldown must be a number of hours.");
      return;
    }
    const rounded = Math.round(parsed);
    if (rounded < 1 || rounded > 168) {
      setSmartSendingError("Cooldown must be between 1 and 168 hours.");
      return;
    }
    setSmartSendingError(null);
    saveSmartSendingMutation.mutate({
      enabled: smartSendingEnabled,
      cooldownHours: rounded,
    });
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-16 lg:space-y-24"
    >
      <CompanyInfo saving={saving} handleSave={handleSave} />

      <motion.section variants={fadeInUp}>
        <Card className="overflow-hidden border-border/60 bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b border-border/40">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl font-medium">
                  Smart Sending
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Prevents sending to recipients who were contacted recently.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={smartSendingEnabled}
                  onCheckedChange={setSmartSendingEnabled}
                  aria-label="Enable Smart Sending"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                      aria-label="What is Smart Sending?"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={6}>
                    When enabled, campaigns exclude recipients contacted within
                    the cooldown window.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="smartSendingCooldownHours">
                  Cooldown window (hours)
                </Label>
                <Input
                  id="smartSendingCooldownHours"
                  inputMode="numeric"
                  type="number"
                  min={1}
                  max={168}
                  step={1}
                  value={cooldownHours}
                  onChange={(e) => setCooldownHours(e.target.value)}
                  className="h-12 border-border/80 bg-background"
                  disabled={!smartSendingEnabled}
                />
                <div className="text-xs text-muted-foreground">
                  Recipients contacted within this window won&apos;t receive new
                  campaign emails.
                </div>
                {smartSendingError && (
                  <div className="text-xs text-destructive">
                    {smartSendingError}
                  </div>
                )}
              </div>
              <Button
                type="button"
                onClick={onSaveSmartSending}
                disabled={
                  orgSettingsQuery.isLoading ||
                  saveSmartSendingMutation.isPending
                }
                className="h-12"
              >
                {saveSmartSendingMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
            {orgSettingsQuery.isError && (
              <div className="text-xs text-muted-foreground">
                Unable to load existing Smart Sending settings. Saving will
                create defaults.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>

      <Branding openLogoUpload={openLogoUpload} />

      <TeamMembers
        setShowInviteUserModal={setShowInviteUserModal}
        refreshTrigger={refreshTrigger}
      />

      <SenderVerification refreshTrigger={refreshTrigger} />

      {/* Modals */}
      <LogoUpload
        showLogoUploadModal={showLogoUploadModal}
        setShowLogoUploadModal={setShowLogoUploadModal}
        logoUploadType={logoUploadType}
      />

      <InviteUser
        open={showInviteUserModal}
        onOpenChange={setShowInviteUserModal}
        onSuccess={triggerUpdate}
      />
    </motion.div>
  );
}
