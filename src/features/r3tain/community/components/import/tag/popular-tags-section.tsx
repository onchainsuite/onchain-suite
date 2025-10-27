"use client";

import { motion } from "framer-motion";

import { PopularTags } from "../popular-tags";
import type { Tag } from "@/r3tain/community/types";

interface PopularTagsSectionProps {
  popularTags: Tag[];
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
}

export function PopularTagsSection({
  popularTags,
  selectedTags,
  onTagSelect,
}: PopularTagsSectionProps) {
  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <PopularTags
        popularTags={popularTags}
        selectedTags={selectedTags}
        onTagSelect={onTagSelect}
      />
    </motion.section>
  );
}
