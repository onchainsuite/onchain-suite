"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function OptimizedLoading() {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Simplified progress for mobile
    const timer = setInterval(
      () => {
        setProgress((prev) => {
          const increment = isMobile ? 8 : 5;
          const newProgress = prev + Math.random() * increment + 2;

          if (newProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return newProgress;
        });
      },
      isMobile ? 200 : 300
    );

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, [isMobile]);

  if (!isClient) {
    return (
      <div className="bg-background fixed inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-primary mb-4 text-4xl font-black">R3tain</div>
          <div className="bg-muted h-1 w-32 overflow-hidden rounded-full">
            <div className="bg-primary h-full w-1/3 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="from-background to-primary/5 fixed inset-0 flex items-center justify-center bg-gradient-to-br">
      {/* Simplified background for mobile */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: isMobile
              ? "radial-gradient(circle at 50% 50%, var(--color-primary) 0%, transparent 60%)"
              : `
                radial-gradient(circle at 20% 80%, var(--color-primary) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, var(--color-primary) 0%, transparent 50%)
              `,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: isMobile ? 6 : 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            className={`${isMobile ? "text-5xl" : "text-6xl md:text-7xl"} from-primary via-primary to-primary/70 bg-gradient-to-r bg-clip-text font-black text-transparent`}
            animate={
              isMobile
                ? {}
                : {
                    textShadow: [
                      "0 0 10px var(--color-primary)",
                      "0 0 20px var(--color-primary)",
                      "0 0 10px var(--color-primary)",
                    ],
                  }
            }
            transition={
              isMobile
                ? {}
                : {
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }
            }
          >
            R3tain
          </motion.h1>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-64 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">
              {isMobile ? "Loading..." : "Preparing your experience..."}
            </span>
            <span className="text-primary text-sm font-bold">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="bg-muted/50 h-2 w-full overflow-hidden rounded-full">
            <motion.div
              className="from-primary to-primary/70 h-full rounded-full bg-gradient-to-r"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="bg-primary h-2 w-2 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
