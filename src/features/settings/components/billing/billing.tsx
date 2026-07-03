"use client";

import { motion } from "framer-motion";

import { fadeInUp } from "../../utils";
import InvoiceHistory from "./invoice-history";
import PaymentMethod from "./payment-method";
import PlanUsage from "./plan-usage";

export default function BillingSettings() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PlanUsage />

      <PaymentMethod />

      <InvoiceHistory />
    </motion.div>
  );
}
