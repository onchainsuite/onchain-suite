
"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "../../utils";

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
      className="grid gap-16 lg:gap-24 lg:grid-cols-2"
    >
      <PersonalDetails />
      
      <Security />
    </motion.div>
  );
}
