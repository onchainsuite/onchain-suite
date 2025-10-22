"use client";

import {
  BarChart3,
  Mail,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { ProductTabContent } from "./product-tab-content";
import { Tabs } from "@/ui/tabs";

export default function ProductsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return; // Don't auto-switch when hovering

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3); // Cycle through 3 products
    }, 3000); // Changed from 5000 to 3000ms

    return () => clearInterval(interval);
  }, [isHovering]); // Added isHovering as dependency

  const tabs = [
    {
      title: "R3tain",
      value: "r3tain",
      content: (
        <ProductTabContent
          icon={<Mail className="h-6 w-6 text-primary" />}
          title="R3tain"
          description="Email marketing tool designed specifically to enhance user retention through personalized, behavior-triggered communication deeply integrated with blockchain analytics."
          features={[
            {
              icon: <Target className="h-5 w-5" />,
              title: "Advanced Personalization",
              description:
                "Email segmentation based on user activities off and on chain, wallet transactions, and behavioral patterns",
            },
            {
              icon: <Zap className="h-5 w-5" />,
              title: "Behavioral Automation",
              description:
                "Real-time triggered emails based on precise on-chain events like liquidity changes and NFT transactions",
            },
            {
              icon: <BarChart3 className="h-5 w-5" />,
              title: "Integrated Analytics",
              description:
                "Real-time performance analytics directly integrated, providing instant feedback on campaign effectiveness",
            },
            {
              icon: <TrendingUp className="h-5 w-5" />,
              title: "Retention Focus",
              description:
                "Purpose-built for Web3 brands to maximize user engagement and reduce churn through targeted campaigns",
            },
          ]}
        />
      ),
    },
    {
      title: "Onch3n",
      value: "onch3n",
      content: (
        <ProductTabContent
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
          title="Onch3n"
          description="Retention-focused behavioral analytics tool that captures, processes, and interprets blockchain-based user behavior to boost retention through actionable insights."
          features={[
            {
              icon: <TrendingUp className="h-5 w-5" />,
              title: "AI-Driven Insights",
              description:
                "Predicts churn risks and identifies high-value users with real-time metrics like engagement scores",
            },
            {
              icon: <BarChart3 className="h-5 w-5" />,
              title: "Customizable Dashboards",
              description:
                "Simplifies on-chain data into marketer-friendly visuals highlighting retention signals",
            },
            {
              icon: <Zap className="h-5 w-5" />,
              title: "Seamless R3tain Integration",
              description:
                "Directly feeds insights into R3tain for automated, personalized email campaigns",
            },
            {
              icon: <Target className="h-5 w-5" />,
              title: "Cross-Chain Support",
              description:
                "Analyzes activity across major blockchains including Ethereum, Solana, and Base",
            },
          ]}
        />
      ),
    },
    {
      title: "3ridge",
      value: "3ridge",
      content: (
        <ProductTabContent
          icon={<Shield className="h-6 w-6 text-primary" />}
          title="3ridge"
          description="Core authentication and data management platform enabling Web3 platforms to seamlessly integrate marketing and analytics with privacy-preserving user onboarding."
          features={[
            {
              icon: <Zap className="h-5 w-5" />,
              title: "Seamless Integration",
              description:
                "Simplifies embedding OnchainSuite tools for developers with SDK and API suite",
            },
            {
              icon: <Shield className="h-5 w-5" />,
              title: "Flexible Authentication",
              description:
                "Enables login via email or wallet with zero-knowledge hashing for privacy",
            },
            {
              icon: <Users className="h-5 w-5" />,
              title: "Profile Enrichment",
              description:
                "Unifies user data including email, wallet, socials, and IP for analytics",
            },
            {
              icon: <Target className="h-5 w-5" />,
              title: "Multi-Chain Support",
              description:
                "Supports EVM chains like Ethereum and Polygon, plus non-EVM like Solana",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <section className="relative py-20 px-4 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Products
          </p>
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Integrated Communication Layer
            <br />
            <span className="text-muted-foreground">
              Built Natively for Web3
            </span>
          </h2>
        </div>

        <div
          className="relative [perspective:1000px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Tabs
            tabs={tabs}
            containerClassName="mb-8 justify-center"
            activeTabClassName="bg-primary/10"
            tabClassName="text-sm md:text-base font-medium transition-colors hover:text-foreground"
            contentClassName="mt-12"
          />
        </div>
      </div>
    </section>
  );
}
