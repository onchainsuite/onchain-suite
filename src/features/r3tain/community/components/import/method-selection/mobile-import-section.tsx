"use client";

import { motion } from "framer-motion";
import { Smartphone, Users } from "lucide-react";

import { MobileImportCard } from "../mobile-import-card";

interface MobileImportSectionProps {
  onMobileAction: (action: string) => void;
}

const mobileImportOptions = [
  {
    id: "import-phone",
    title: "Add subscribers from your phone",
    description:
      "Choose and import email subscribers directly from your device's address book",
    actionText: "Import now",
    icon: Smartphone,
  },
  {
    id: "scan-upload",
    title: "Scan and upload subscribers",
    description:
      "Add email subscribers instantly by scanning or uploading a contact image",
    actionText: "Try now",
    icon: Users,
  },
];

export function MobileImportSection({
  onMobileAction,
}: MobileImportSectionProps) {
  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="bg-card border-border rounded-2xl border p-6 lg:p-8"
    >
      <div className="mb-6">
        <h3 className="text-foreground mb-2 text-xl font-semibold lg:text-2xl">
          Import from 3ridge
        </h3>
        <p className="text-muted-foreground">
          Import email subscribers from the 3ridge mobile app
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {mobileImportOptions.map((option, index) => (
          <MobileImportCard
            key={option.id}
            title={option.title}
            description={option.description}
            actionText={option.actionText}
            onAction={() => onMobileAction(option.id)}
            illustration={<option.icon className="text-primary h-8 w-8" />}
            delay={1.0 + index * 0.1}
          />
        ))}
      </div>
    </motion.section>
  );
}
