"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { fadeInUp } from "../../utils";
import InviteUser from "../invite-user";
import LogoUpload from "../logo-upload";
import Branding from "./branding";
import CompanyInfo from "./company-info";
import SenderVerification from "./sender-verification";
import TeamMembers from "./team-members";

export default function AccountSettings() {
  const [showLogoUploadModal, setShowLogoUploadModal] = useState(false);
  const [logoUploadType, setLogoUploadType] = useState<
    "primary" | "dark" | "favicon"
  >("primary");
  const [showInviteUserModal, setShowInviteUserModal] = useState(false);
  const [showVerifySenderModal, setShowVerifySenderModal] = useState(false);
  const [newSenderEmail, setNewSenderEmail] = useState("");
  const [newSenderName, setNewSenderName] = useState("");
  const [saving, setSaving] = useState(false);

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

  const handleAddSender = async () => {
    if (!newSenderEmail) return;
    setSaving(true);
    try {
      const response = await fetch("/api/v1/organization/sender-identities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newSenderEmail,
          name: newSenderName,
        }),
      });

      if (response.ok) {
        toast.success("Sender identity added");
        setShowVerifySenderModal(false);
        setNewSenderEmail("");
        setNewSenderName("");
        // Ideally force refresh SenderVerification list
        window.location.reload();
      } else {
        toast.error("Failed to add sender identity");
      }
    } catch (error) {
      toast.error("Failed to add sender identity");
    } finally {
      setSaving(false);
    }
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

      <Branding openLogoUpload={openLogoUpload} />

      <TeamMembers setShowInviteUserModal={setShowInviteUserModal} />

      <SenderVerification setShowVerifySenderModal={setShowVerifySenderModal} />

      {/* Modals */}
      <LogoUpload
        showLogoUploadModal={showLogoUploadModal}
        setShowLogoUploadModal={setShowLogoUploadModal}
        logoUploadType={logoUploadType}
      />

      <InviteUser
        open={showInviteUserModal}
        onOpenChange={setShowInviteUserModal}
      />

      <Dialog
        open={showVerifySenderModal}
        onOpenChange={setShowVerifySenderModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify new sender</DialogTitle>
            <DialogDescription>
              Add a new sender email address to use in your campaigns.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Sender name</Label>
              <Input
                placeholder="Marketing Team"
                value={newSenderName}
                onChange={(e) => setNewSenderName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email address</Label>
              <Input
                placeholder="marketing@company.com"
                value={newSenderEmail}
                onChange={(e) => setNewSenderEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowVerifySenderModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSender}
              disabled={saving || !newSenderEmail}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Verify sender"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
