"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";

import { fadeInUp } from "../../utils";
import SettingsSectionCard from "@/features/settings/components/settings-section-card";
import FloatingSparkles from "./floating-sparkles";
import RewardsContent from "./rewards-content";

export default function RewardsSettings() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <SettingsSectionCard
        title="Rewards"
        description="Track upcoming rewards and join the launch waitlist."
        icon={<Gift className="h-5 w-5" />}
        badge="Coming soon"
      >
        <div className="relative flex flex-col items-center justify-center py-10 text-center lg:py-16">
          <FloatingSparkles />
          <RewardsContent />
        </div>
      </SettingsSectionCard>
    </motion.div>
  );
}
