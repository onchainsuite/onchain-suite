
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeInUp, staggerContainer } from "../../utils";

const Security = () => {
  return (
    <motion.section variants={staggerContainer} initial="initial" animate="animate">
      <motion.h2
        variants={fadeInUp}
        className="text-xl font-light tracking-tight text-foreground lg:text-2xl"
      >
        Security
      </motion.h2>
      <motion.p variants={fadeInUp} className="mt-3 text-muted-foreground">
        Protect your account
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="mt-8 border-t border-border/60 pt-8 lg:mt-10 lg:pt-10"
      >
        <div className="space-y-6 lg:space-y-8">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Current password
            </Label>
            <Input
              type="password"
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              New password
            </Label>
            <Input
              type="password"
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full justify-between h-12 border-border/80 text-foreground hover:bg-muted hover:text-foreground"
            >
              <span>Two-factor authentication</span>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                Enabled
              </span>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Security;
