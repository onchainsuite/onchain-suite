import { motion } from "framer-motion";
import React from "react";

import { Button } from "@/components/ui/button";

import { fadeInUp, staggerContainer } from "../../utils";

const PaymentMethod = () => {
  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h2
        variants={fadeInUp}
        className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
      >
        Payment method
      </motion.h2>
      <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
        Manage your payment details
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 lg:mt-10 lg:pt-10"
      >
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-6 lg:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-muted">
              <span className="font-mono text-sm font-bold tracking-wider text-muted-foreground">
                VISA
              </span>
            </div>
            <div>
              <div className="font-medium text-foreground">
                Visa ending in 4242
              </div>
              <div className="text-sm text-muted-foreground">Expires 12/24</div>
            </div>
          </div>
          <Button
            variant="outline"
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            Update
          </Button>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default PaymentMethod;
