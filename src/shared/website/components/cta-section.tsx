"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/ui/button";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      {/* Animated decorative arcs */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        <motion.svg
          width="800"
          height="200"
          viewBox="0 0 800 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 0.3, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.path
            d="M 100 150 Q 250 50, 400 100 T 700 150"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-muted-foreground"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: true }}
          />
          <motion.path
            d="M 50 120 Q 200 30, 400 80 T 750 120"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-muted-foreground"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
            viewport={{ once: true }}
          />
          <motion.path
            d="M 150 180 Q 300 80, 400 130 T 650 180"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-muted-foreground"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.4, ease: "easeInOut" }}
            viewport={{ once: true }}
          />
        </motion.svg>
      </div>

      <motion.div
        ref={ref}
        className="container relative z-10 mx-auto px-4"
        animate={{
          scale: isInView ? 1 : 0.8,
          opacity: isInView ? 1 : 0.5,
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        <div className="mx-auto max-w-4xl text-center">
          {/* Heading */}
          <h2 className="mb-6 text-balance text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Transform Your Web3 Marketing
          </h2>

          {/* Subheading */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Synthesize on-chain and off-chain data for personalized engagement
            at scale
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group min-w-[160px]">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-[160px] bg-transparent"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
