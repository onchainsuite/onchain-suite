
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, ShieldCheck, AlertCircle, Check, Loader2 } from "lucide-react";
import { fadeInUp, staggerContainer, senders } from "../../utils";

interface SenderVerificationProps {
  setShowVerifySenderModal: (show: boolean) => void;
}

const SenderVerification = ({ setShowVerifySenderModal }: SenderVerificationProps) => {
  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <motion.h2
            variants={fadeInUp}
            className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
          >
            Sender verification
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
            Manage verified sender addresses and domain authentication
          </motion.p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => setShowVerifySenderModal(true)}
            className="h-11 bg-primary px-6 text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add sender
          </Button>
        </motion.div>
      </div>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 lg:mt-10 lg:pt-10"
      >
        {/* Desktop table */}
        <div className="hidden space-y-3 lg:block">
          <div className="grid grid-cols-6 gap-4 px-6 py-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-2">Sender</div>
            <div>Domain</div>
            <div>DKIM</div>
            <div>SPF</div>
            <div className="text-right">Status</div>
          </div>
          {senders.map((sender, idx) => (
            <motion.div
              key={sender.email}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{
                y: -2,
                boxShadow: "0 25px 50px -12px rgba(var(--primary-rgb), 0.08)",
              }}
              className="group grid grid-cols-6 items-center gap-4 rounded-xl border border-border/60 bg-card px-6 py-5 transition-all duration-300"
              style={{ minHeight: "80px" }}
            >
              <div className="col-span-2">
                <p className="font-medium text-foreground">{sender.email}</p>
                <p className="mt-1 text-sm text-muted-foreground">{sender.name}</p>
              </div>
              <div className="text-sm text-muted-foreground">{sender.domain}</div>
              <div>
                {sender.dkim ? (
                  <span className="inline-flex items-center gap-1 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs font-medium">Pass</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">Fail</span>
                  </span>
                )}
              </div>
              <div>
                {sender.spf ? (
                  <span className="inline-flex items-center gap-1 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs font-medium">Pass</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">Fail</span>
                  </span>
                )}
              </div>
              <div className="text-right">
                {sender.status === "verified" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary">
                    <Check className="h-3 w-3" />
                    Verified
                  </span>
                )}
                {sender.status === "pending" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-700">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Pending
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default SenderVerification;
