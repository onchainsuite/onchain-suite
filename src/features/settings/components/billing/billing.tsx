"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { fadeInUp } from "../../utils";
import InvoiceHistory from "./invoice-history";
import PaymentMethod from "./payment-method";
import PlanUsage from "./plan-usage";

export default function BillingSettings() {
  const [optimisePlan, setOptimisePlan] = useState(true);

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-16 lg:space-y-24"
    >
      <PlanUsage
        optimisePlan={optimisePlan}
        setOptimisePlan={setOptimisePlan}
      />

      <PaymentMethod />

      <InvoiceHistory />
    </motion.div>
  );
}
