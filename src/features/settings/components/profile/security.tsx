import { motion } from "framer-motion";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

import { fadeInUp, staggerContainer } from "../../utils";
import TwoFactorAuthModal from "../two-factor-auth-modal";

const Security = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTwoFAModal, setShowTwoFAModal] = useState(false);
  const { data: session } = authClient.useSession();

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    setLoading(true);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const toggleTwoFA = () => {
    setShowTwoFAModal(true);
  };

  return (
    <motion.section
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <TwoFactorAuthModal
        open={showTwoFAModal}
        onOpenChange={setShowTwoFAModal}
      />
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
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              New password
            </Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 border-border/80 bg-background text-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <Button
            onClick={handlePasswordChange}
            disabled={loading}
            className="w-full h-11"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>

          <div className="pt-4">
            <Button
              variant="outline"
              onClick={toggleTwoFA}
              className="w-full justify-between h-12 border-border/80 text-foreground hover:bg-muted hover:text-foreground"
            >
              <span>Two-factor authentication</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  session?.user?.twoFactorEnabled
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {session?.user?.twoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Security;
