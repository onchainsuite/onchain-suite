"use client";

import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";

export function HeroSection() {
  // Web3-relevant words for Onchain Suite
  const fromWords = [
    "Wallet Analytics",
    "Onchain Data",
    "User Behavior",
    "Blockchain Insights",
  ];
  const toWords = [
    "Smart Campaigns",
    "Targeted Retention",
    "Growth Marketing",
    "User Engagement",
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-center px-6 py-32 md:px-12 lg:px-16">
        <div className="max-w-4xl">
          {/* Main heading with flip words */}
          <h1 className="mb-8 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-7xl">
            <span className="flex items-center">
              <span className="text-muted-foreground text-xs sm:text-2xl md:text-4xl font-light">
                {"From "}
              </span>
              <span className="inline-block">
                <FlipWords words={fromWords} className="text-foreground" />
              </span>
            </span>
            <span className="flex items-center">
              <span className="text-muted-foreground text-xs sm:text-2xl md:text-4xl font-light">
                {"to "}
              </span>
              <span className="inline-block">
                <FlipWords words={toWords} className="text-foreground" />
              </span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="mb-12 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {
              "The first integrated communication layer built natively for Web3."
            }
            <br />
            {
              "Synthesizing on-chain activities with off-chain interactions for targeted, personalized user engagement at scale."
            }
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
