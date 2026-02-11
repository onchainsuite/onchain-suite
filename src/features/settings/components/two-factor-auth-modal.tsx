import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Copy,
  Loader2,
  Lock,
  QrCode,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authClient } from "@/lib/auth-client";

interface TwoFactorAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TwoFactorAuthModal = ({
  open,
  onOpenChange,
}: TwoFactorAuthModalProps) => {
  const { data: session } = authClient.useSession();
  const [twoFACode, setTwoFACode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"initial" | "password" | "qr" | "backup">(
    "initial"
  );
  const [totpURI, setTotpURI] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep("initial");
      setTwoFACode("");
      setPassword("");
      setTotpURI("");
      setBackupCodes([]);
      setError("");
    }
  }, [open]);

  const isEnabled = session?.user?.twoFactorEnabled;

  const handleEnableStart = () => {
    setStep("password");
    setError("");
  };

  const handlePasswordSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authClient.twoFactor.enable({
        password,
      });

      if (res.data) {
        setTotpURI(res.data.totpURI);
        setBackupCodes(res.data.backupCodes || []);
        setStep("qr");
      } else if (res.error) {
        setError(res.error.message || "An error occurred");
        toast.error(res.error.message || "An error occurred");
      }
    } catch (e) {
      setError("Failed to start 2FA setup");
      toast.error("Failed to start 2FA setup");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (twoFACode.length < 6) {
      setError("Code must be 6 digits");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authClient.twoFactor.verifyTotp({
        code: twoFACode,
      });

      if (res.data) {
        toast.success("2FA enabled successfully");
        setStep("backup");
      } else if (res.error) {
        setError(res.error.message || "An error occurred");
        toast.error(res.error.message || "An error occurred");
      }
    } catch (e) {
      setError("Invalid code");
      toast.error("Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (step !== "password") {
      setStep("password");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await authClient.twoFactor.disable({
        password,
      });
      if (res.data) {
        toast.success("2FA disabled");
        onOpenChange(false);
        window.location.reload();
      } else {
        setError(res.error?.message || "Failed to disable 2FA");
        toast.error(res.error?.message || "Failed to disable 2FA");
      }
    } catch (e) {
      setError("Failed to disable 2FA");
      toast.error("Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("Backup codes copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0 gap-0 border-border/80 bg-background/95 backdrop-blur-xl">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-tight text-foreground">
              Two-factor authentication
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5">
              {isEnabled && step === "initial"
                ? "Manage your 2FA settings"
                : "Add an extra layer of security to your account"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {isEnabled && step === "initial" && (
              <motion.div
                key="enabled-initial"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-emerald-500/20 p-1">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        2FA is currently enabled
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300/80">
                        Your account is protected with TOTP. You can reconfigure
                        it or disable it below.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("password")}
                    className="h-11 w-full justify-start gap-3 border-border/60 hover:bg-muted/50"
                  >
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        Reconfigure 2FA
                      </span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep("password")}
                    className="h-11 w-full justify-start gap-3 border-border/60 hover:bg-red-50 hover:text-red-600 hover:border-red-100 dark:hover:bg-red-900/10 dark:hover:border-red-900/30 dark:hover:text-red-400 transition-colors"
                  >
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-medium">Disable 2FA</span>
                  </Button>
                </div>
              </motion.div>
            )}

            {!isEnabled && step === "initial" && (
              <motion.div
                key="disabled-initial"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center justify-center gap-4 py-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 shadow-inner">
                    <QrCode className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-foreground">
                      Authenticator App
                    </h4>
                    <p className="text-sm text-muted-foreground max-w-[260px] mx-auto">
                      Use apps like Google Authenticator or Authy to generate
                      verification codes.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleEnableStart}
                  className="w-full h-11 shadow-lg shadow-primary/20"
                >
                  Setup 2FA
                </Button>
              </motion.div>
            )}

            {step === "password" && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Password Confirmation
                  </Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="h-11 bg-muted/30"
                    autoFocus
                  />
                  {error && (
                    <p className="text-xs text-red-500 flex items-center gap-1.5">
                      <AlertCircle className="h-3 w-3" /> {error}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setStep("initial")}
                    className="h-10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={isEnabled ? handleDisable : handlePasswordSubmit}
                    disabled={loading || !password}
                    className="h-10 min-w-[100px]"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isEnabled ? "Disable 2FA" : "Continue"}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "qr" && (
              <motion.div
                key="qr"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="relative flex items-center justify-center rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
                    {totpURI ? (
                      <QRCode
                        value={totpURI}
                        size={160}
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          width: "100%",
                        }}
                      />
                    ) : (
                      <div className="h-40 w-40 animate-pulse bg-muted rounded-lg" />
                    )}
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Scan this QR code with your authenticator app
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Verification code
                  </Label>
                  <Input
                    value={twoFACode}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 6);
                      setTwoFACode(val);
                      if (error) setError("");
                    }}
                    placeholder="000000"
                    className="h-12 text-center text-lg tracking-[0.5em] font-mono bg-muted/30"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  {error && (
                    <p className="text-xs text-red-500 flex items-center gap-1.5 justify-center">
                      <AlertCircle className="h-3 w-3" /> {error}
                    </p>
                  )}
                </div>

                {isEnabled && (
                  <div className="rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-400">
                    2FA is currently enabled. Verify a new code to change
                    devices.
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setStep("initial")}
                    className="h-10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleVerify}
                    disabled={loading || twoFACode.length !== 6}
                    className="h-10 min-w-[100px] bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Verify
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "backup" && (
              <motion.div
                key="backup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/20">
                  <h4 className="flex items-center gap-2 font-medium text-amber-900 dark:text-amber-100">
                    <AlertCircle className="h-4 w-4" />
                    Save your backup codes
                  </h4>
                  <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-200/80">
                    If you lose access to your authenticator device, you can use
                    these codes to log in. Keep them safe.
                  </p>
                </div>

                <div className="relative rounded-lg border border-border/60 bg-muted/50 p-4 font-mono text-sm">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    {backupCodes.map((code, i) => (
                      <div
                        key={i}
                        className="rounded bg-background py-1 px-2 border border-border/40"
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2 h-8 w-8 hover:bg-background/80"
                    onClick={copyBackupCodes}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <Button
                  onClick={() => onOpenChange(false)}
                  className="w-full h-11"
                >
                  I have saved my codes
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthModal;
