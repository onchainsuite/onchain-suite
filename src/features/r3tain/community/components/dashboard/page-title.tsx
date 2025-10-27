"use client";

import { motion } from "framer-motion";

export function PageTitle() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-background/95 border-border sticky top-0 z-40 border-b px-4 py-4 backdrop-blur-sm lg:px-8"
    >
      <h1 className="text-foreground text-2xl font-bold lg:text-3xl">
        Community Dashboard
      </h1>
    </motion.div>
  );
}
