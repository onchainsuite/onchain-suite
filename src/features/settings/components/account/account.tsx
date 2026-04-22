"use client";

import { motion } from "framer-motion";
import { useState } from "react";

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
  const [saving, setSaving] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
