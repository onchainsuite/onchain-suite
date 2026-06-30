import { ArrowPathIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { fadeInUp } from "../utils";

interface ChangePasswordProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePassword = ({ open, onOpenChange }: ChangePasswordProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (callback: () => void) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    callback();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-tight text-foreground">
            Change password
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your current password and choose a new one
          </DialogDescription>
        </DialogHeader>
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.2 }}
          className="mt-6 space-y-6"
        >
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Current password
            </Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-12 border-border/80"
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
              className="h-12 border-border/80"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Confirm new password
            </Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 border-border/80"
            />
          </div>
        </motion.div>
        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border/80"
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleSave(() => {
                onOpenChange(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              })
            }
            disabled={
              saving ||
              !currentPassword ||
              !newPassword ||
              newPassword !== confirmPassword
            }
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saving ? (
              <ArrowPathIcon
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <LockClosedIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Update password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
