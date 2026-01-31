import { Loader2, QrCode, ShieldCheck, Copy, Check, Lock } from "lucide-react";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

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
  const [step, setStep] = useState<"initial" | "password" | "qr" | "backup">("initial");
  const [totpURI, setTotpURI] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep("initial");
      setTwoFACode("");
      setPassword("");
      setTotpURI("");
      setBackupCodes([]);
    }
  }, [open]);

  const isEnabled = session?.user?.twoFactorEnabled;

  const handleEnableStart = () => {
    setStep("password");
  };

  const handlePasswordSubmit = async () => {
    setLoading(true);
    try {
      const res = await authClient.twoFactor.enable({
        password: password
      });
      
      if (res.data) {
        setTotpURI(res.data.totpURI);
        setBackupCodes(res.data.backupCodes || []);
        setStep("qr");
      } else if (res.error) {
        toast.error(res.error.message);
      }
    } catch (e) {
      toast.error("Failed to start 2FA setup");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await authClient.twoFactor.verifyTotp({
        code: twoFACode,
      });

      if (res.data) {
        toast.success("2FA enabled successfully");
        setStep("backup");
      } else if (res.error) {
        toast.error(res.error.message);
      }
    } catch (e) {
      toast.error("Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
      // For disable, we might need password too, or just confirmation if session is active
      // better-auth disable usually requires password
      if(step !== 'password') {
          setStep('password');
          return;
      }

      setLoading(true);
      try {
          const res = await authClient.twoFactor.disable({
              password
          });
          if(res.data) {
              toast.success("2FA disabled");
              onOpenChange(false);
              window.location.reload(); 
          } else {
              toast.error(res.error?.message || "Failed to disable 2FA");
          }
      } catch(e) {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-tight text-foreground">
            Two-factor authentication
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEnabled 
                ? "Manage your 2FA settings" 
                : "Add an extra layer of security to your account"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {isEnabled && step === "initial" && (
             <div className="rounded-xl bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  2FA is currently <span className="font-medium">enabled</span>.
                </p>
                <Button variant="outline" size="sm" onClick={() => setStep("password")} className="mt-4 w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:hover:bg-red-900/20">
                    Disable 2FA
                </Button>
             </div>
          )}

          {!isEnabled && step === "initial" && (
             <div className="space-y-4">
                 <div className="flex flex-col items-center rounded-2xl bg-muted/50 p-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm">
                        <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Protect your account with TOTP (Authenticator App)
                    </p>
                 </div>
                 <Button onClick={handleEnableStart} className="w-full">
                     Setup 2FA
                 </Button>
             </div>
          )}

          {step === "password" && (
              <div className="space-y-3">
                  <Label>Enter your password to continue</Label>
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Current password"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                      <Button variant="ghost" onClick={() => setStep("initial")}>Cancel</Button>
                      <Button 
                        onClick={isEnabled ? handleDisable : handlePasswordSubmit} 
                        disabled={loading || !password}
                      >
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isEnabled ? "Disable 2FA" : "Continue"}
                      </Button>
                  </div>
              </div>
          )}

          {step === "qr" && (
              <div className="space-y-6">
                  <div className="flex flex-col items-center rounded-2xl bg-white p-6">
                     {totpURI && (
                         <div className="h-48 w-48 bg-white p-2">
                             <QRCode value={totpURI} style={{ height: "100%", width: "100%" }} />
                         </div>
                     )}
                     <p className="mt-4 text-sm text-muted-foreground text-center">
                         Scan this code with your authenticator app (Google Authenticator, Authy, etc.)
                     </p>
                  </div>

                  <div className="space-y-3">
                    <Label>Verification code</Label>
                    <Input
                      placeholder="000000"
                      value={twoFACode}
                      onChange={(e) => setTwoFACode(e.target.value)}
                      className="h-12 text-center font-mono text-lg tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <Button onClick={handleVerify} disabled={loading || twoFACode.length !== 6} className="w-full">
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Verify & Enable
                  </Button>
              </div>
          )}

          {step === "backup" && (
              <div className="space-y-4">
                  <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/20">
                      <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Save these backup codes
                      </h4>
                      <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mb-4">
                          If you lose access to your device, these codes are the only way to recover your account. Keep them safe.
                      </p>
                      <div className="grid grid-cols-2 gap-2 font-mono text-sm bg-background/50 p-4 rounded-lg">
                          {backupCodes.map((code, i) => (
                              <div key={i} className="text-center">{code}</div>
                          ))}
                      </div>
                  </div>
                  <Button onClick={copyBackupCodes} variant="outline" className="w-full gap-2">
                      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {isCopied ? "Copied" : "Copy codes"}
                  </Button>
                  <Button onClick={() => { onOpenChange(false); window.location.reload(); }} className="w-full">
                      Done
                  </Button>
              </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthModal;
