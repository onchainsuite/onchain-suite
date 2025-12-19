import { Loader2, QrCode, ShieldCheck } from "lucide-react";
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

interface TwoFactorAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TwoFactorAuthModal = ({
  open,
  onOpenChange,
}: TwoFactorAuthModalProps) => {
  const [twoFACode, setTwoFACode] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (callback: () => void) => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    callback();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-tight text-foreground">
            Two-factor authentication
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Manage your 2FA settings
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <div className="flex flex-col items-center rounded-2xl bg-muted/50 p-6 lg:p-8">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-background shadow-lg lg:h-32 lg:w-32">
              <QrCode className="h-16 w-16 text-foreground lg:h-20 lg:w-20" />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Scan with your authenticator app
            </p>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Verification code
            </Label>
            <Input
              placeholder="000000"
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value)}
              className="h-12 border-border/80 text-center font-mono text-lg tracking-widest"
              maxLength={6}
            />
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              2FA is currently <span className="font-medium">enabled</span>.
              Enter a code to disable it, or scan a new QR code to change
              devices.
            </p>
          </div>
        </div>
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
                setTwoFACode("");
              })
            }
            disabled={saving || twoFACode.length !== 6}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-4 w-4" />
            )}
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthModal;
