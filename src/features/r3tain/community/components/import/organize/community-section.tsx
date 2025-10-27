"use client";

import { motion } from "framer-motion";

import { CommunitySelector } from "../community-selector";
import type { Community } from "@/r3tain/community/types";

interface CommunitySectionProps {
  communities: Community[];
  selectedCommunityId: string;
  onCommunityChange: (communityId: string) => void;
}

export function CommunitySection({
  communities,
  selectedCommunityId,
  onCommunityChange,
}: CommunitySectionProps) {
  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <CommunitySelector
        communities={communities}
        selectedCommunityId={selectedCommunityId}
        onCommunityChange={onCommunityChange}
      />
    </motion.section>
  );
}
