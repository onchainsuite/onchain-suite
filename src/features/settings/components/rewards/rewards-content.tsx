import { motion } from "framer-motion";
import { Gift, Mail, Sparkles } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

const RewardsContent = () => {
  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-primary/10 to-primary/20 lg:h-24 lg:w-24"
      >
        <Gift className="h-10 w-10 text-primary lg:h-12 lg:w-12" />
        <motion.div
          className="absolute -right-1 -top-1"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          }}
        >
          <Sparkles className="h-5 w-5 text-primary" />
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-xl font-light tracking-tight text-foreground lg:text-2xl"
      >
        Rewards program coming soon
      </motion.h2>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 max-w-md text-muted-foreground"
      >
        Earn credits for referrals, usage milestones, and community
        contributions. Be the first to know when we launch.
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button className="mt-8 h-11 bg-primary px-8 text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/10">
          <Mail className="mr-2 h-4 w-4" />
          Notify me
        </Button>
      </motion.div>
    </>
  );
};

export default RewardsContent;
