"use client";

import { motion } from "framer-motion";

import CompanyEditForm from "@/features/settings/components/account/company-edit-form";
import { fadeInUp } from "@/features/settings/utils";

export default function CompanySettingsView() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto py-8 space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-light tracking-tight text-foreground">
          Company Settings
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Manage your organization details, billing information, and public
          profile.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid gap-6">
        <CompanyEditForm />
      </motion.div>
    </motion.div>
  );
}
