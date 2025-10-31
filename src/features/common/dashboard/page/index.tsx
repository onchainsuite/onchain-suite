"use client";

import { Loader2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";

import {
  ActivityFeed,
  DashboardFooter,
  MetricsGrid,
  ProductWalkthrough,
  QuickWinsCarousel,
  SetupBanner,
  SetupFlow,
  SuiteSpotlight,
} from "@/common/dashboard/components";
import type { SetupData } from "@/common/dashboard/types";

interface UserData {
  projectName: string;
  userType: "DeFi" | "Gaming" | "DAO";
  trialDaysLeft?: number;
  isNewUser: boolean;
  subscriptionTier: "free_trial" | "limited_free" | "full_paid" | "r3tain_only";
}

interface MainDashboardProps {
  userData: UserData;
}

export function MainDashboard({ userData }: MainDashboardProps) {
  const [showSetup, setShowSetup] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughComplete, setWalkthroughComplete] = useState(false);

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
    <div className="min-h-screen bg-linear-to-br from-background via-primary/10 to-secondary/10">
      {showWalkthrough && (
        <ProductWalkthrough
          onComplete={handleWalkthroughComplete}
          projectName={userData.projectName}
        />
      )}

      <div className="space-y-6">
        {!setupComplete && !showSetup && (
          <SetupBanner onComplete={() => setShowSetup(true)} />
        )}

        {showSetup && (
          <SetupFlow
            onComplete={handleSetupComplete}
            onDismiss={handleSetupDismiss}
          />
        )}

        {setupComplete && walkthroughComplete && (
          <>
            <MetricsGrid
              isNewUser={userData.isNewUser}
              userType={userData.userType}
            />

            {userData.isNewUser && (
              <Card className="border-primary/50 bg-primary/5 backdrop-blur-sm shadow-lg shadow-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">
                        First Wins Await – +25% Projected Lift!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Complete your first campaign to unlock full analytics
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {(userData.isNewUser ||
              (userData.trialDaysLeft && userData.trialDaysLeft > 0)) && (
              <QuickWinsCarousel />
            )}

            <SuiteSpotlight userData={userData} />

            <ActivityFeed />

            <DashboardFooter />
          </>
        )}

        {setupComplete && !walkthroughComplete && !showWalkthrough && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="border-primary/30 bg-card/95 backdrop-blur-xl shadow-2xl max-w-md">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Setting Up Your Dashboard
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We&apos;re preparing your retention platform. This will just
                    take a moment...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
