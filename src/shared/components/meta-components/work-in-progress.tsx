"use client";

import { motion, useAnimation } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Code,
  Cog,
  Hammer,
  Lightbulb,
  Mail,
  Rocket,
  Settings,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { FloatingIcon, Particle } from "@/types/ui";

interface WorkInProgressPageProps {
  featureName?: string;
  expectedRelease?: string;
  description?: string;
  progress?: number;
}

export default function WorkInProgressPage({
  featureName = "Automations",
  expectedRelease = "Q2 2024",
  description = "Advanced workflow automation tools to streamline your marketing campaigns",
  progress = 75,
}: WorkInProgressPageProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([]);
  const [codeBlocks, setCodeBlocks] = useState<Particle[]>([]);

  const controls = useAnimation();

  useEffect(() => {
    // Generate floating icons
    const icons = [
      Code,
      Cog,
      Hammer,
      Lightbulb,
      Rocket,
      Settings,
      Sparkles,
      Wrench,
      Zap,
    ];
    const newFloatingIcons = [...Array(12)].map((_, i) => ({
      icon: icons[i % icons.length],
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 80 + 10}%`,
      delay: Math.random() * 4,
      duration: 6 + Math.random() * 4,
      scale: 0.8 + Math.random() * 0.4,
    }));
    setFloatingIcons(newFloatingIcons);

    // Generate code blocks
    const newCodeBlocks = [...Array(8)].map(() => ({
      left: `${Math.random() * 85 + 5}%`,
      top: `${Math.random() * 75 + 10}%`,
      delay: Math.random() * 3,
      width: 60 + Math.random() * 40,
      duration: 8 + Math.random() * 4,
    }));
    setCodeBlocks(newCodeBlocks);

    // Start main animation sequence
    controls.start("visible");
  }, [controls]);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <div className="from-background via-background to-primary/5 relative min-h-screen overflow-hidden bg-linear-to-br">
      {/* Animated Background Grid */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "40px 40px"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Floating Icons */}
      <div className="pointer-events-none absolute inset-0">
        {floatingIcons.map((item) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={uuidv4()}
              className="absolute"
              style={{
                left: item.left,
                top: item.top,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [item.scale, item.scale * 1.2, item.scale],
              }}
              transition={{
                duration: item.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: item.delay,
                ease: "easeInOut",
              }}
            >
              <IconComponent className="text-primary/20 h-6 w-6" />
            </motion.div>
          );
        })}
      </div>

      {/* Floating Code Blocks */}
      <div className="pointer-events-none absolute inset-0">
        {codeBlocks.map((block) => (
          <motion.div
            key={uuidv4()}
            className="bg-primary/5 border-primary/10 absolute rounded border p-2"
            style={{
              left: block.left,
              top: block.top,
              width: `${block.width}px`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: block.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: block.delay,
              ease: "easeInOut",
            }}
          >
            <div className="space-y-1">
              <div className="bg-primary/20 h-1 w-3/4 rounded" />
              <div className="bg-primary/15 h-1 w-1/2 rounded" />
              <div className="bg-primary/10 h-1 w-2/3 rounded" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.div
          className="mx-auto max-w-4xl space-y-12 text-center"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.8,
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {/* Main Illustration */}
          <motion.div
            className="relative mx-auto mb-12 h-80 w-80"
            variants={{
              hidden: { scale: 0.8, opacity: 0 },
              visible: { scale: 1, opacity: 1 },
            }}
          >
            {/* Central Construction Area */}
            <motion.div
              className="from-primary/10 via-primary/5 border-primary/20 absolute inset-0 rounded-3xl border bg-linear-to-br to-transparent backdrop-blur-sm"
              animate={{
                boxShadow: [
                  "0 0 0 0 color-mix(in srgb, var(--color-primary) 20%, transparent)",
                  "0 0 0 20px color-mix(in srgb, var(--color-primary) 0%, transparent)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />

            {/* Animated Gears */}
            <motion.div
              className="absolute top-8 left-8"
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Cog className="text-primary/60 h-16 w-16" />
            </motion.div>

            <motion.div
              className="absolute top-16 right-12"
              animate={{ rotate: -360 }}
              transition={{
                duration: 12,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Settings className="text-primary/40 h-12 w-12" />
            </motion.div>

            {/* Central Rocket */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="relative">
                <Rocket className="text-primary h-20 w-20" />
                {/* Rocket Trail */}
                <motion.div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <Sparkles className="h-8 w-8 text-yellow-500/60" />
                </motion.div>
              </div>
            </motion.div>

            {/* Construction Tools */}
            <motion.div
              className="absolute bottom-8 left-12"
              animate={{
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Hammer className="text-primary/50 h-10 w-10" />
            </motion.div>

            <motion.div
              className="absolute right-8 bottom-12"
              animate={{
                rotate: [0, -10, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <Wrench className="text-primary/50 h-8 w-8" />
            </motion.div>

            {/* Progress Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={uuidv4()}
                className="bg-primary/40 absolute h-2 w-2 rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${60 + Math.sin(i) * 20}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-8"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            {/* Status Badge */}
            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium"
              >
                <Zap className="mr-2 h-4 w-4" />
                Work in Progress
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                className="from-foreground via-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-4xl font-black text-transparent md:text-6xl"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                {featureName}
              </motion.h1>

              <motion.p
                className="text-muted-foreground text-xl font-medium md:text-2xl"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                Coming Soon
              </motion.p>
            </div>

            {/* Description */}
            <motion.p
              className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {description}
            </motion.p>

            {/* Progress Section */}
            <motion.div
              className="mx-auto max-w-md space-y-6"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/80 text-sm font-medium">
                    Development Progress
                  </span>
                  <span className="text-primary text-sm font-bold">
                    {progress}%
                  </span>
                </div>

                <div className="relative">
                  <div className="bg-muted/50 h-3 w-full overflow-hidden rounded-full backdrop-blur-sm">
                    <motion.div
                      className="from-primary via-primary/90 to-primary/70 relative h-full overflow-hidden rounded-full bg-linear-to-r"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 2, delay: 1, ease: "easeOut" }}
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
                </div>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  Expected Release:{" "}
                  <span className="text-primary font-semibold">
                    {expectedRelease}
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Notification Signup */}
            <motion.div
              className="mx-auto max-w-md space-y-6"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {!isSubscribed ? (
                <form onSubmit={handleNotifyMe} className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Button type="submit" className="sm:w-auto">
                      <Bell className="mr-2 h-4 w-4" />
                      Notify Me
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Get notified when {featureName} is ready to launch
                  </p>
                </form>
              ) : (
                <motion.div
                  className="space-y-3 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                    <Mail className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="font-medium text-green-600">
                    You&apos;re all set!
                  </p>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ll notify you when {featureName} is ready
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>

              <Button asChild size="lg">
                <Link href="/features">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explore Features
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Ambient Effects */}
      <motion.div
        className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 8%, transparent)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="pointer-events-none absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full blur-3xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 6%, transparent)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}
