"use client";

import { Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function OnboardingHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-white mb-2">
        Welcome to OnchainSuite
      </h1>
      <p className="text-lg text-white/70">
        Your unified Web3 retention platform
      </p>
      <div className="flex items-center justify-center gap-2 mt-4">
        <Badge
          variant="outline"
          className="bg-teal-500/20 text-teal-300 border-teal-500/30"
        >
          <Shield className="mr-1 h-3 w-3" />
          ZK-Secured
        </Badge>
        <Badge
          variant="outline"
          className="bg-purple-500/20 text-purple-300 border-purple-500/30"
        >
          7-Day Full Trial
        </Badge>
      </div>
    </div>
  );
}
