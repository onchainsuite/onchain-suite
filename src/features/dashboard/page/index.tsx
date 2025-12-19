"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActivitySection } from "@/features/dashboard/components/activity-section";
import { CommandBar } from "../components/command-bar";
import { GetStartedSection } from "@/features/dashboard/components/get-started";
import type { SetupData } from "../types";

interface UserData {
  projectName: string;
  userType: "DeFi" | "Gaming" | "DAO";
  trialDaysLeft?: number;
  isNewUser: boolean;
  subscriptionTier: "free_trial" | "limited_free" | "full_paid" | "r3tain_only";
  fullName?: string;
  timezone?: string;
}

interface MainDashboardProps {
  userData: UserData;
}

export function MainDashboard({ userData }: MainDashboardProps) {
  const [showSetup, setShowSetup] = useState(false);
  const [setupComplete, setSetupComplete] = useState(true);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughComplete, setWalkthroughComplete] = useState(true);

  const getGreeting = (tz?: string) => {
    let hour = new Date().getHours();
    try {
      if (tz) {
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          hour: "numeric",
          hour12: false,
        }).formatToParts(new Date());
        const hourPart = parts.find((p) => p.type === "hour");
        if (hourPart) {
          hour = parseInt(hourPart.value, 10);
        }
      }
    } catch {
      hour = new Date().getHours();
    }
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  useEffect(() => {
    const setupCompleted = localStorage.getItem("setup_complete");
    const walkthroughCompleted = localStorage.getItem("walkthrough_complete");

    if (setupCompleted === "true") {
      setSetupComplete(true);
      if (walkthroughCompleted !== "true") {
        setShowWalkthrough(true);
      } else {
        setWalkthroughComplete(true);
      }
    } else {
      setShowSetup(true);
    }

    if (userData.isNewUser && walkthroughCompleted === "true") {
      toast.info(
        `Suite Live—Your ${userData.userType} Engine is Purring!,
        Welcome to OnchainSuite. Your retention platform is ready.`
      );
    }
  }, [userData.isNewUser, userData.userType]);

  const handleSetupComplete = (data: SetupData) => {
    localStorage.setItem("setup_complete", "true");
    localStorage.setItem("setup_data", JSON.stringify(data));
    setSetupComplete(true);
    setShowSetup(false);
    setShowWalkthrough(true);
    toast.success(
      "Setup Complete!, Let's take a quick tour of your dashboard."
    );
  };

  const handleWalkthroughComplete = () => {
    localStorage.setItem("walkthrough_complete", "true");
    setWalkthroughComplete(true);
    setShowWalkthrough(false);
    toast.success(
      "Welcome to OnchainSuite!,Your retention platform is ready to go. Start building!"
    );
  };

  const handleSetupDismiss = () => {
    setShowSetup(false);
  };

  return (
    <div className="min-h-screen rounded-2xl bg-linear-to-b from-background via-primary/10 to-secondary/5">
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-linear-to-r from-muted to-primary/10 mx-40 py-8 text-center">
          <div className="text-2xl font-semibold">
            {`Good ${getGreeting(userData.timezone)}, ${userData.fullName ?? "there"}!`}
          </div>
          <div className="my-2 text-sm text-muted-foreground">
            Time to focus on what matters most
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-3 py-6 md:px-6 md:py-8">
          {/* Command Bar */}
          <CommandBar />

          {/* Get Started Section */}
          <GetStartedSection />

          {/* Activity Section */}
          <ActivitySection />
        </div>
      </div>
    </div>
  );
}
