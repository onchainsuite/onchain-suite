"use client";

import { motion } from "framer-motion";

import { fadeInUp } from "../../utils";
import DangerZone from "./danger-zone";
import PersonalDetails from "./personal-details";
import Security from "./security";

export default function ProfileSettings() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PersonalDetails />

      <Security />

      <DangerZone />
    </motion.div>
  );
}
