"use client";

import { motion } from "framer-motion";

import { fadeInUp } from "../../utils";
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
      className="relative flex flex-col items-center justify-center py-20 text-center lg:py-32"
    >
      <FloatingSparkles />
      <RewardsContent />
    </motion.div>
  );
}
