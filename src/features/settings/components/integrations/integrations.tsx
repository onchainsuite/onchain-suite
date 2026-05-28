"use client";

import { motion } from "framer-motion";

import { fadeInUp, staggerContainer } from "../../utils";
import InAppIntegration from "./inapp";

export default function IntegrationsSettings() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-16 lg:space-y-24"
    >
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
        >
          In-app integration
        </motion.h2>
        <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
          Configure SDK keys, allowed origins, and test delivery
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-8 border-t border-border/60 pt-8 space-y-6 lg:mt-10 lg:pt-10 lg:space-y-8"
        >
          <InAppIntegration />
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
