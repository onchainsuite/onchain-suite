"use client";

import { CheckCircle2, Globe, Wallet, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { SetupStepProps } from "@/common/dashboard/types";

export function UniversalSetupStep({ formData, setFormData }: SetupStepProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setTimeout(() => {
      const mockAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
      setFormData({ ...formData, walletAddress: mockAddress });
      setIsConnecting(false);
      toast.success("Your wallet has been verified via ZK-proof.");
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="wallet" className="flex items-center gap-2 mb-2">
          <Wallet className="h-4 w-4" />
          Wallet Address
          <Badge variant="secondary" className="text-xs">
            Optional
          </Badge>
        </Label>
        {formData.walletAddress ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <span className="text-sm font-mono text-green-300">
              {formData.walletAddress.slice(0, 6)}...
              {formData.walletAddress.slice(-4)}
            </span>
          </div>
        ) : (
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            variant="outline"
            className="w-full bg-transparent"
          >
            {isConnecting ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-pulse" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect MetaMask / Phantom
              </>
            )}
          </Button>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Proves ownership via ZK-proof, enables on-chain triggers
        </p>
      </div>

      <div>
        <Label htmlFor="projectName" className="flex items-center gap-2 mb-2">
          Project Name
          <Badge variant="destructive" className="text-xs">
            Required
          </Badge>
        </Label>
        <Input
          id="projectName"
          placeholder="e.g., YieldFarm DAO"
          value={formData.projectName}
          onChange={(e) =>
            setFormData({ ...formData, projectName: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="website" className="flex items-center gap-2 mb-2">
          <Globe className="h-4 w-4" />
          Website / dApp URL
          <Badge variant="secondary" className="text-xs">
            Optional
          </Badge>
        </Label>
        <Input
          id="website"
          type="url"
          placeholder="https://yourproject.com"
          value={formData.website ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
        />
        <p className="text-xs text-muted-foreground mt-1">
          Auto-scrapes favicon and helps tailor email previews
        </p>
      </div>
    </div>
  );
}
