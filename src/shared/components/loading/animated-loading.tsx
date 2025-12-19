"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const phases = [
  "Connecting to blockchain...",
  "Loading campaign data...",
  "Initializing analytics...",
  "Preparing dashboard...",
  "Almost ready...",
];

export default function AnimatedLoading() {
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    // Set window height on client side
    setWindowHeight(window.innerHeight);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 12 + 3;
        const phaseIndex = Math.floor((newProgress / 100) * phases.length);
        setLoadingPhase(Math.min(phaseIndex, phases.length - 1));

        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="from-background via-background to-primary/5 fixed inset-0 flex items-center justify-center overflow-hidden bg-linear-to-br">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Animated mesh gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, var(--color-primary) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, var(--color-primary) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, var(--color-primary) 0%, transparent 50%)
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

        {/* Dynamic grid */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-primary) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "60px 60px"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-12">
        {/* Enhanced Logo with Morphing Effect */}
        <motion.div
          className="relative"
          initial={{ scale: 0.3, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="group relative">
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl blur-3xl"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 20%, transparent)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Main logo */}
            <motion.div className="relative">
              <motion.h1
                className="from-primary via-primary to-primary/70 bg-linear-to-r bg-clip-text text-7xl font-black tracking-tight text-transparent md:text-8xl"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                R3tain
              </motion.h1>

              {/* Animated "3" with special effect */}
              <motion.div
                className="pointer-events-none absolute top-0 left-0 h-full w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <motion.span
                  className="text-primary/80 absolute text-7xl font-black md:text-8xl"
                  style={{ left: "2.1em", top: 0 }}
                  animate={{
                    textShadow: [
                      "0 0 10px var(--color-primary)",
                      "0 0 20px var(--color-primary)",
                      "0 0 10px var(--color-primary)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  3
                </motion.span>
              </motion.div>

              {/* Sophisticated underline */}
              <motion.div
                className="via-primary absolute right-0 -bottom-4 left-0 h-1 rounded-full bg-linear-to-r from-transparent to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
              />
            </motion.div>

            {/* Orbiting elements */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              {[0, 120, 240].map((angle, i) => (
                <motion.div
                  key={angle}
                  className="bg-primary/60 absolute h-3 w-3 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                    transformOrigin: "0 0",
                    transform: `rotate(${angle}deg) translateX(120px) translateY(-6px)`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Feature Showcase */}
        <motion.div
          className="flex items-center justify-center space-x-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {/* Email Marketing Hub */}
          <motion.div
            className="group relative"
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              <motion.div
                className="border-primary/70 bg-primary/5 relative h-8 w-12 overflow-hidden rounded-lg border-2 backdrop-blur-sm"
                animate={{
                  boxShadow: [
                    "0 0 0 0 color-mix(in srgb, var(--color-primary) 30%, transparent)",
                    "0 0 0 8px color-mix(in srgb, var(--color-primary) 0%, transparent)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <motion.div
                  className="border-primary/50 absolute inset-2 border-t-2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    delay: 2,
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                />
                <motion.div
                  className="bg-primary/60 absolute top-1 right-1 h-2 w-2 rounded-full"
                  animate={{ scale: [0, 1, 0] }}
                  transition={{
                    delay: 3,
                    duration: 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 4,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Advanced Analytics */}
          <motion.div
            className="group relative"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <div className="bg-primary/5 flex items-end space-x-1.5 rounded-lg p-2 backdrop-blur-sm">
              {[0.3, 0.7, 0.5, 0.9, 0.6, 0.8].map((height, i) => (
                <motion.div
                  key={uuidv4()}
                  className="from-primary to-primary/60 w-2.5 rounded-t-sm bg-linear-to-t"
                  initial={{ height: 4 }}
                  animate={{ height: height * 32 }}
                  transition={{
                    delay: 2.5 + i * 0.15,
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Blockchain Network */}
          <motion.div
            className="group relative"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="bg-primary/5 relative h-12 w-12 rounded-lg p-2 backdrop-blur-sm">
              {[
                { x: 8, y: 8 },
                { x: 24, y: 8 },
                { x: 8, y: 24 },
                { x: 24, y: 24 },
                { x: 16, y: 16 },
              ].map((pos, i) => (
                <motion.div
                  key={`pos-${pos.x}-${pos.y}`}
                  className="bg-primary/70 absolute h-2.5 w-2.5 rounded-full"
                  style={{ left: pos.x, top: pos.y }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 2.8 + i * 0.2,
                  }}
                />
              ))}

              {/* Connection lines */}
              <svg
                className="absolute inset-0 h-full w-full"
                aria-label="Connection lines"
              >
                <title>Network connection visualization</title>
                {[
                  { x1: 13, y1: 13, x2: 29, y2: 13 },
                  { x1: 13, y1: 13, x2: 13, y2: 29 },
                  { x1: 29, y1: 13, x2: 29, y2: 29 },
                  { x1: 13, y1: 29, x2: 29, y2: 29 },
                  { x1: 21, y1: 21, x2: 13, y2: 13 },
                  { x1: 21, y1: 21, x2: 29, y2: 29 },
                ].map((line, i) => (
                  <motion.line
                    key={`line-${line.x1}-${line.y1}-${line.x2}-${line.y2}`}
                    {...line}
                    stroke="var(--color-primary)"
                    strokeWidth="1.5"
                    opacity="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 3.5 + i * 0.1, duration: 0.8 }}
                  />
                ))}
              </svg>
            </div>
          </motion.div>
        </motion.div>

        {/* Premium Progress Section */}
        <motion.div
          className="w-80 space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          {/* Progress info */}
          <div className="flex items-center justify-between">
            <motion.span
              className="text-foreground/80 text-sm font-medium"
              key={loadingPhase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {phases[loadingPhase]}
            </motion.span>
            <motion.span
              className="text-primary text-sm font-bold tabular-nums"
              animate={{ scale: progress > 0 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>

          {/* Enhanced progress bar */}
          <div className="relative">
            <div className="bg-muted/50 h-3 w-full overflow-hidden rounded-full backdrop-blur-sm">
              <motion.div
                className="from-primary via-primary/90 to-primary/70 relative h-full overflow-hidden rounded-full bg-linear-to-r"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>

            {/* Progress glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-md"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 20%, transparent)",
              }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </motion.div>

        {/* Elegant status text */}
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          <motion.p
            className="text-muted-foreground text-base font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            Crafting your premium marketing experience
          </motion.p>

          {/* Sophisticated loading dots */}
          <motion.div
            className="flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="bg-primary h-2 w-2 rounded-full"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Premium particle system */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {windowHeight > 0 &&
          [...Array(12)].map((_) => (
            <motion.div
              key={uuidv4()}
              className="bg-primary/30 absolute h-1 w-1 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 20}%`,
              }}
              animate={{
                y: [-20, -windowHeight - 100],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 3,
                ease: "easeOut",
              }}
            />
          ))}
      </div>

      {/* Ambient light effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 10%, transparent)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full blur-3xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 8%, transparent)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}
