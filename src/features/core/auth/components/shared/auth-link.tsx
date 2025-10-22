"use client";

import { motion } from "framer-motion";

interface AuthLinkProps {
  text: string;
  linkText: string;
  onClick: () => void;
  delay?: number;
}

export function AuthLink({
  text,
  linkText,
  onClick,
  delay = 0.8,
}: AuthLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="mt-6 text-center"
    >
      <p className="text-muted-foreground text-sm">
        {text}{" "}
        <button
          onClick={onClick}
          className="text-primary font-medium transition-colors hover:underline"
        >
          {linkText}
        </button>
      </p>
    </motion.div>
  );
}
