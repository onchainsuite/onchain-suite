"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <motion.section
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mx-auto max-w-4xl px-4 text-center"
    >
      <motion.h2
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="from-primary to-primary/60 mb-4 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent sm:text-3xl lg:mb-6 lg:text-5xl"
      >
        Grow Your R3tain Community
      </motion.h2>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-muted-foreground mx-auto mb-6 max-w-2xl px-4 text-base leading-relaxed lg:mb-8 lg:text-lg"
      >
        Your community is where you&apos;ll connect and engage with your
        members. Once you add your community members, you&apos;ll be able to
        send your first campaign. We&apos;ll walk you through the process.
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          onClick={onGetStarted}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-3 text-sm shadow-lg transition-all duration-300 hover:shadow-xl lg:px-8 lg:text-base"
        >
          <Plus className="mr-2 h-4 w-4" />
          Get Started with your Community
        </Button>
      </motion.div>
    </motion.section>
  );
}
