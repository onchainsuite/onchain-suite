"use client";

import { motion } from "framer-motion";

import { UpdateSettings } from "../update-settings";

interface UpdateSectionProps {
  updateExisting: boolean;
  onUpdateChange: (checked: boolean) => void;
  onHelpClick: () => void;
}

export function UpdateSection({
  updateExisting,
  onUpdateChange,
  onHelpClick,
}: UpdateSectionProps) {
  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <UpdateSettings
        updateExisting={updateExisting}
        onUpdateChange={onUpdateChange}
        onHelpClick={onHelpClick}
      />
    </motion.section>
  );
}
