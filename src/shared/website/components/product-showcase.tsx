"use client";

import { motion, useInView, useSpring } from "framer-motion";
import { useRef } from "react";
import { v7 as uuidv7 } from "uuid";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const stats = [
  {
    value: 15,
    suffix: "+",
    label: "Blockchain Networks Integrated",
  },
  {
    value: 500,
    suffix: "K+",
    label: "Wallet Addresses Tracked",
  },
  {
    value: 2,
    suffix: "M+",
    label: "On-Chain Events Processed",
  },
  {
    value: 95,
    suffix: "%",
    label: "Email Delivery Rate",
  },
  {
    value: 10,
    suffix: "K+",
    label: "Automated Campaigns",
  },
  {
    value: 3,
    suffix: "x",
    label: "Average Retention Boost",
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 30,
  });

  if (isInView && springValue.get() === 0) {
    springValue.set(value);
  }

  return (
    <motion.div
      ref={ref}
      className="mb-1 text-2xl font-bold text-foreground md:mb-2 md:text-4xl lg:text-5xl"
    >
      <motion.span>
        {springValue.get() === 0 ? "0" : Math.round(springValue.get())}
      </motion.span>
      {suffix}
    </motion.div>
  );
}

export default function ProductShowcase() {
  return (
    <div className="relative flex w-full flex-col items-center justify-start">
      <ContainerScroll
        titleComponent={
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-5xl lg:text-6xl">
            The First Integrated Communication Layer
            <br />
            <span className="text-muted-foreground">
              Built Natively for Web3
            </span>
          </h2>
        }
      >
        <video
          className="h-full w-full object-cover rounded-lg"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/placeholder-video.mp4" type="video/mp4" />
        </video>
        {/* Fallback placeholder if video doesn't load */}
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-xl">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <svg
                className="h-16 w-16 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Product Demo Video</p>
          </div>
        </div>
      </ContainerScroll>

      <div className="w-full border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-3 md:gap-8 md:py-12 lg:grid-cols-6">
          {stats.map((stat) => (
            <div key={uuidv7()} className="text-center">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <div className="text-xs text-muted-foreground md:text-sm lg:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
