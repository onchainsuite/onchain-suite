"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../utils";

import ApiKey from "./api-key";
import Webhooks from "./webhooks";
import ConnectedApps from "./connected-apps";

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
          Developer tools
        </motion.h2>
        <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
          API access and webhook configuration
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-8 border-t border-border/60 pt-8 space-y-6 lg:mt-10 lg:pt-10 lg:space-y-8"
        >
          <ApiKey />
          <Webhooks />
        </motion.div>
      </motion.section>

      <ConnectedApps />
    </motion.div>
  );
}
