"use client";

import { Button } from "@/components/ui/button";

interface WelcomeSectionProps {
  userName: string;
}

export function WelcomeSection({ userName }: WelcomeSectionProps) {
  return (
    <div className="flex h-full flex-col justify-center px-4 py-6 lg:px-0 lg:py-0">
      <h1 className="text-foreground text-2xl font-bold sm:text-3xl lg:text-4xl">
        Hello {userName}
      </h1>
      <p className="text-muted-foreground mt-3 text-base sm:text-lg lg:mt-4">
        Welcome to R3tain! Let&apos;s get you started with your first campaign.
      </p>
      <div className="mt-4 lg:mt-6">
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
          size="lg"
        >
          Upgrade now
        </Button>
      </div>
    </div>
  );
}
