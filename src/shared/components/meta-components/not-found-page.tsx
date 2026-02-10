"use client";

import { motion, useAnimation } from "framer-motion";
import { ArrowLeft, Globe, Home, Search, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { FloatingParticle, FloatingSymbol } from "@/components/common";
import { Button } from "@/ui/button";

import { PRIVATE_ROUTES, publicRoutes } from "@/shared/config/app-routes";

export default function NotFoundPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true);

    // Detect mobile device
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Only add mouse tracking on non-mobile devices
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isClient) {
      controls.start({
        rotate: [0, 5, -5, 0],
        transition: {
          duration: isMobile ? 8 : 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      });
    }
  }, [controls, isClient, isMobile]);

  // Prevent rendering until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="from-background via-background to-primary/5 flex min-h-screen items-center justify-center bg-linear-to-br">
        <div className="text-center">
          <div className="from-primary via-primary to-primary/70 mb-4 bg-linear-to-r bg-clip-text text-8xl font-black text-transparent">
            404
          </div>
          <h2 className="mb-4 text-2xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button size="lg">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="from-background via-background to-primary/5 relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br">
      {/* Simplified Background for Mobile */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, var(--color-primary) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, var(--color-primary) 0%, transparent 50%)
              ${!isMobile ? ", radial-gradient(circle at 40% 40%, var(--color-primary) 0%, transparent 50%)" : ""}
            `,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: isMobile ? 10 : 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Interactive cursor effect - Desktop only */}
        {!isMobile && (
          <motion.div
            className="pointer-events-none absolute h-96 w-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
              opacity: 0.1,
            }}
            animate={{
              x: mousePosition.x - 192,
              y: mousePosition.y - 192,
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
          />
        )}

        {/* Floating geometric shapes - Reduced on mobile */}

        <FloatingSymbol elementNo={isMobile ? 4 : 8}>
          {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
            <div
              key={uuidv4()}
              className={`h-4 w-4 ${
                i % 3 === 0
                  ? "rounded-full"
                  : i % 3 === 1
                    ? "rounded-sm"
                    : "rotate-45"
              } bg-primary/20`}
            />
          ))}
        </FloatingSymbol>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated 404 - Simplified animation on mobile */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mb-8"
          >
            <motion.h1
              animate={isMobile ? {} : controls}
              className="text-6xl leading-none font-black sm:text-8xl md:text-9xl lg:text-[12rem]"
            >
              <span className="from-primary via-primary to-primary/70 relative bg-linear-to-r bg-clip-text text-transparent">
                4
                {!isMobile && (
                  <motion.div
                    className="from-primary/20 absolute inset-0 rounded-3xl bg-linear-to-r to-transparent blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </span>
              <span className="from-foreground via-foreground to-foreground/70 relative mx-2 bg-linear-to-r bg-clip-text text-transparent sm:mx-4">
                0{/* Simplified orbiting elements for mobile */}
                {!isMobile && (
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 15,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    {[0, 120, 240].map((angle, i) => (
                      <motion.div
                        key={uuidv4()}
                        className="bg-primary/60 absolute h-2 w-2 rounded-full sm:h-3 sm:w-3"
                        style={{
                          left: "50%",
                          top: "50%",
                          transformOrigin: "0 0",
                          transform: `rotate(${angle}deg) translateX(40px) translateY(-4px)`,
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
                )}
              </span>
              <span className="from-primary via-primary to-primary/70 relative bg-linear-to-r bg-clip-text text-transparent">
                4
                {!isMobile && (
                  <motion.div
                    className="from-primary/20 absolute inset-0 rounded-3xl bg-linear-to-r to-transparent blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1.5,
                    }}
                  />
                )}
              </span>
            </motion.h1>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">
              Oops! This page got lost in the{" "}
              <span className="from-primary to-primary/70 bg-linear-to-r bg-clip-text text-transparent">
                blockchain
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
              Don&apos;t worry, even the best explorers sometimes take a wrong
              turn. Let&apos;s get you back on track to revolutionize your
              marketing game.
            </p>
          </motion.div>

          {/* Animated Icons - Simplified on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8 flex items-center justify-center space-x-4 sm:mb-12 sm:space-x-8"
          >
            {[
              { icon: Sparkles, delay: 0 },
              { icon: Zap, delay: 0.2 },
              { icon: Globe, delay: 0.4 },
            ].map(({ icon: Icon, delay }) => (
              <motion.div
                key={uuidv4()}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + delay }}
                whileHover={!isMobile ? { scale: 1.2, rotate: 10 } : {}}
                whileTap={{ scale: 0.95 }}
                className="from-primary/10 to-primary/5 border-primary/20 group flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border bg-linear-to-r sm:h-16 sm:w-16 sm:rounded-2xl"
              >
                <Icon className="text-primary group-hover:text-primary/80 h-6 w-6 transition-colors sm:h-8 sm:w-8" />
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-8 flex flex-col items-center justify-center gap-4 sm:mb-12 sm:flex-row"
          >
            <Link href={publicRoutes.HOME}>
              <Button
                size={isMobile ? "default" : "lg"}
                className="group w-full px-6 py-4 text-base font-semibold sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
              >
                <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
                Back to Home
              </Button>
            </Link>
            <Link href={PRIVATE_ROUTES.DASHBOARD}>
              <Button
                variant="outline"
                size={isMobile ? "default" : "lg"}
                className="group w-full px-6 py-4 text-base font-semibold sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 sm:h-5 sm:w-5" />
                Go Back
              </Button>
            </Link>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mx-auto max-w-md"
          >
            <p className="text-muted-foreground mb-4 text-sm">
              Or search for what you&apos;re looking for:
            </p>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transform sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search features, docs, help..."
                className="border-border bg-background/50 focus:ring-primary/20 focus:border-primary w-full rounded-xl border py-3 pr-4 pl-10 text-center text-sm backdrop-blur-sm transition-all focus:ring-2 focus:outline-none sm:py-4 sm:pl-12 sm:text-left sm:text-base"
              />
            </div>
          </motion.div>

          {/* Popular Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 sm:mt-16"
          >
            <p className="text-muted-foreground mb-6 text-sm">
              Popular destinations:
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {[
                "Features",
                "Pricing",
                "Documentation",
                "API Reference",
                "Help Center",
                "Community",
              ].map((link, index) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase().replace(" ", "-")}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                  whileHover={!isMobile ? { scale: 1.05, y: -2 } : {}}
                  whileTap={{ scale: 0.95 }}
                  className="bg-muted/50 hover:bg-primary/10 border-border hover:border-primary/20 rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating particles - Reduced count and complexity on mobile */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <FloatingParticle particleNo={isMobile ? 6 : 12} />
      </div>

      {/* Simplified ambient lighting for mobile */}
      {!isMobile && (
        <>
          <motion.div
            className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary) 10%, transparent)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
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
                "color-mix(in srgb, var(--color-primary) 8%, transparent)",
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.08, 0.2, 0.08],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </>
      )}
    </div>
  );
}
