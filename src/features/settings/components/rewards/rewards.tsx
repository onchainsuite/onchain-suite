"use client";

import { GiftIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

import { fadeInUp } from "../../utils";
import FloatingSparkles from "./floating-sparkles";
import RewardsContent from "./rewards-content";
import SettingsSectionCard from "@/features/settings/components/settings-section-card";

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
        icon={<GiftIcon className="h-5 w-5" aria-hidden="true" />}
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
