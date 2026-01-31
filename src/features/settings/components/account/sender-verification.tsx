import { motion } from "framer-motion";
import { AlertCircle, Check, Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { fadeInUp, staggerContainer } from "../../utils";
import { authClient } from "@/lib/auth-client";

interface SenderVerificationProps {
  setShowVerifySenderModal: (show: boolean) => void;
}

const SenderVerification = ({
  setShowVerifySenderModal,
}: SenderVerificationProps) => {
  const { data: session } = authClient.useSession();
  const [senders, setSenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSenders = async () => {
        if (!session?.session?.activeOrganizationId) return;
        setLoading(true);
        try {
            const response = await fetch("/api/v1/organization/sender-identities");
            if (response.ok) {
                const data = await response.json();
                setSenders(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to fetch senders", error);
        } finally {
            setLoading(false);
        }
    };
    fetchSenders();
  }, [session]);

  const handleRemoveSender = async (id: string) => {
      try {
          const response = await fetch(`/api/v1/organization/sender-identities/${id}`, {
              method: "DELETE"
          });
          if (response.ok) {
              toast.success("Sender removed");
              setSenders(senders.filter(s => s.id !== id));
          } else {
              toast.error("Failed to remove sender");
          }
      } catch (error) {
          toast.error("Failed to remove sender");
      }
  };

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
          {senders.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                  No verified senders found.
              </div>
          )}
          {senders.map((sender, idx) => (
            <motion.div
              key={sender.id}
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
                <p className="mt-1 text-sm text-muted-foreground">
                  {sender.name}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {sender.domain}
              </div>
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
                   <Button
                     variant="ghost"
                     size="icon"
                     className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                     onClick={() => handleRemoveSender(sender.id)}
                   >
                       <Trash2 className="h-4 w-4" />
                   </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default SenderVerification;
