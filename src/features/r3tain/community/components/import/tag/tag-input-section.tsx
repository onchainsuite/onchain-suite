"use client";

import { motion } from "framer-motion";

import { TagSearchInput } from "../tag-search-input";
import type { Tag } from "@/r3tain/community/types";

interface TagInputSectionProps {
  selectedTags: Tag[];
  availableTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

export function TagInputSection({
  selectedTags,
  availableTags,
  onTagsChange,
}: TagInputSectionProps) {
  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <TagSearchInput
        selectedTags={selectedTags}
        availableTags={availableTags}
        onTagsChange={onTagsChange}
        placeholder="Search for or create tags"
      />
    </motion.section>
  );
}
