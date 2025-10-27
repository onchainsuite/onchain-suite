"use client";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";

import type { Tag } from "@/r3tain/community/types";

interface PopularTagsProps {
  popularTags: Tag[];
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
}

export function PopularTags({
  popularTags,
  selectedTags,
  onTagSelect,
}: PopularTagsProps) {
  const availableTags = popularTags.filter(
    (tag) => !selectedTags.some((selected) => selected.id === tag.id)
  );

  if (availableTags.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-4"
    >
      <h3 className="text-foreground text-base font-medium">
        Choose from popular tags
      </h3>
      <div className="flex flex-wrap gap-3">
        {availableTags.map((tag, index) => (
          <motion.div
            key={tag.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              variant="outline"
              className="border-border hover:border-primary/50 hover:bg-primary/5 bg-background cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200"
              onClick={() => onTagSelect(tag)}
            >
              {tag.name}
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
