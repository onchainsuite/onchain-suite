"use client";
import { ArrowRight } from "lucide-react";
import { useScroll, useTransform } from "motion/react";
import React from "react";

import { Button } from "@/ui/button";
import { GoogleGeminiEffect } from "@/ui/google-gemini-effect";

export function CTASection() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div
      className="h-[300vh] bg-background w-full rounded-md relative pt-40 overflow-clip"
      ref={ref}
    >
      <GoogleGeminiEffect
        title="Transform Your Web3 Marketing"
        description="Synthesize on-chain and off-chain data for personalized engagement at scale"
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      >
        <div className="md:mt-12 mt-8 flex items-center justify-center z-30 gap-3">
          <Button className="group min-w-[160px] md:text-base text-xs md:px-4 md:py-2 px-2 py-1">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            variant="outline"
            className="min-w-[160px] md:text-base text-xs md:px-4 md:py-2 px-2 py-1"
          >
            Book a Demo
          </Button>
        </div>
      </GoogleGeminiEffect>
    </div>
  );
}
