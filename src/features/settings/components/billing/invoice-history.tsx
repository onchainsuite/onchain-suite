import { motion } from "framer-motion";
import { Download } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

import { fadeInUp, invoices, staggerContainer } from "../../utils";

const InvoiceHistory = () => {
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
        Invoices
      </motion.h2>
      <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
        View and download your billing history
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 lg:mt-10 lg:pt-10"
      >
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
          <div className="grid grid-cols-4 gap-4 border-b border-border/40 bg-muted/50 px-6 py-4 text-sm font-medium text-muted-foreground">
            <div>Invoice</div>
            <div>Date</div>
            <div>Amount</div>
            <div className="text-right">Download</div>
          </div>
          {invoices.map((invoice, idx) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="grid grid-cols-4 items-center gap-4 border-b border-border/40 px-6 py-4 last:border-0 hover:bg-muted/50"
            >
              <div className="font-medium text-foreground">{invoice.id}</div>
              <div className="text-muted-foreground">{invoice.date}</div>
              <div className="text-foreground">{invoice.amount}</div>
              <div className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground/50 hover:text-primary hover:bg-primary/10"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default InvoiceHistory;
