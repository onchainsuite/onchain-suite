"use client";

import { motion } from "framer-motion";

export function EmptyStateIllustration() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Background Circle */}
        <motion.div
          className="from-primary/5 via-primary/10 to-primary/5 absolute inset-0 -m-8 rounded-full bg-gradient-to-br"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Main Chart Container */}
        <motion.div
          className="border-border/30 from-card via-card/90 to-card/80 relative h-32 w-40 rounded-xl border-2 bg-gradient-to-br shadow-lg backdrop-blur-sm"
          animate={{
            y: [0, -6, 0],
            rotateX: [0, 2, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {/* Chart Header */}
          <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-red-400/60" />
              <div className="h-1.5 w-1.5 rounded-full bg-yellow-400/60" />
              <div className="h-1.5 w-1.5 rounded-full bg-green-400/60" />
            </div>
            <div className="bg-muted/40 h-1 w-8 rounded" />
          </div>

          {/* Chart Title */}
          <div className="absolute top-6 right-3 left-3">
            <div className="bg-muted/30 h-2 w-16 rounded" />
          </div>

          {/* Chart Bars */}
          <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-2">
            {[
              {
                height: "60%",
                delay: 0.2,
                color: "from-blue-400/60 to-blue-500/80",
              },
              {
                height: "85%",
                delay: 0.4,
                color: "from-purple-400/60 to-purple-500/80",
              },
              {
                height: "45%",
                delay: 0.6,
                color: "from-pink-400/60 to-pink-500/80",
              },
              {
                height: "70%",
                delay: 0.8,
                color: "from-indigo-400/60 to-indigo-500/80",
              },
              {
                height: "55%",
                delay: 1.0,
                color: "from-cyan-400/60 to-cyan-500/80",
              },
            ].map((bar, index) => (
              <motion.div
                key={index}
                className={`w-4 rounded-t-sm bg-gradient-to-t ${bar.color} shadow-sm`}
                style={{ height: bar.height }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 0.9, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: bar.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Chart Grid Lines */}
          <div className="absolute inset-4 top-10">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-muted/20 absolute right-0 left-0 h-px"
                style={{ top: `${(i + 1) * 25}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Floating Data Points */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="from-primary/40 to-primary/60 absolute h-2 w-2 rounded-full bg-gradient-to-br shadow-sm"
            style={{
              left: `${30 + Math.cos((i * 45 * Math.PI) / 180) * 80}px`,
              top: `${30 + Math.sin((i * 45 * Math.PI) / 180) * 80}px`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Left Magnifying Glass */}
        <motion.div
          className="absolute top-4 -left-20"
          animate={{
            x: [0, 4, 0, -2, 0],
            rotate: [0, 8, 0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <div className="border-primary/40 from-primary/10 to-primary/20 h-12 w-12 rounded-full border-3 bg-gradient-to-br" />
            <motion.div
              className="bg-primary/50 absolute -right-2 -bottom-2 h-6 w-1 origin-top rotate-45 rounded-full"
              animate={{ rotate: [45, 50, 45] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            {/* Magnifying glass reflection */}
            <div className="absolute top-2 left-2 h-3 w-3 rounded-full bg-white/30" />
          </div>
        </motion.div>

        {/* Right Trend Arrow */}
        <motion.div
          className="absolute top-6 -right-20"
          animate={{
            x: [0, -4, 0, 2, 0],
            y: [0, -2, 0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div className="relative">
            <motion.div
              className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-400/20 to-green-500/30 p-1.5"
              animate={{ rotate: [0, 5, 0, -3, 0] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-full w-full text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </motion.div>
            {/* Sparkle effect */}
            <motion.div
              className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-400/60"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.5,
              }}
            />
          </div>
        </motion.div>

        {/* Bottom Document Stack */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2"
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <div className="relative">
            {/* Document stack */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="border-border/30 bg-card absolute h-6 w-8 rounded-sm border shadow-sm"
                style={{
                  transform: `translate(${i * 2}px, ${i * -2}px)`,
                  zIndex: 3 - i,
                }}
                animate={{
                  rotate: [0, i * 2, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                }}
              >
                {/* Document lines */}
                <div className="absolute top-1.5 right-1 left-1 space-y-0.5">
                  <div className="bg-muted/40 h-0.5 w-full rounded" />
                  <div className="bg-muted/30 h-0.5 w-3/4 rounded" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ambient Light Effect */}
        <motion.div
          className="bg-gradient-radial from-primary/5 absolute inset-0 -m-12 rounded-full via-transparent to-transparent"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}
