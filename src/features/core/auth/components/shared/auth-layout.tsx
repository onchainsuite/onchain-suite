"use client";

import { motion } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";

import { FloatingParticle } from "@/components/common";

interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AuthLayout({ children, className = "" }: AuthLayoutProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="from-background via-background to-primary/5 relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br p-4">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, var(--color-primary) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, var(--color-primary) 0%, transparent 50%)
            `,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Interactive cursor glow */}
        <motion.div
          className="pointer-events-none absolute h-96 w-96 rounded-full opacity-10 dark:opacity-5"
          style={{
            background:
              "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          }}
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />

        {/* Floating particles */}
        <FloatingParticle particleNo={8} />
      </div>

      <div className={`relative z-10 w-full max-w-md ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card/80 border-border/50 rounded-2xl border p-8 shadow-2xl backdrop-blur-xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
