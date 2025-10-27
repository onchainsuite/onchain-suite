"use client";

import { motion } from "framer-motion";

import { LoadingButton } from "@/ui/loading-button";

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  text?: string;
  delay?: number;
}

export function ContinueButton({
  onClick,
  disabled = false,
  loading = false,
  text = "Continue",
  delay = 0.8,
}: ContinueButtonProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="flex justify-center"
    >
      <LoadingButton
        size="lg"
        onClick={onClick}
        disabled={disabled}
        isLoading={loading}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 shadow-lg transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {text}
      </LoadingButton>
    </motion.div>
  );
}
