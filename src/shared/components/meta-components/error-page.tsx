/* eslint-disable no-alert */
"use client";

import { motion, useAnimation } from "framer-motion";
import { AlertTriangle, Bug, Home, Mail, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import { FloatingParticle, FloatingSymbol } from "@/components/common";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isRetrying, setIsRetrying] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    controls.start({
      rotate: [0, -2, 2, 0],
      scale: [1, 1.02, 1],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    });
  }, [controls]);

  const handleRetry = async () => {
    if (reset) {
      setIsRetrying(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate retry delay
      reset();
      setIsRetrying(false);
    }
  };

  const handleReportError = () => {
    const errorDetails = {
      message: error?.message ?? "Unknown error",
      digest: error?.digest,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // In a real app, you'd send this to your error reporting service
    // eslint-disable-next-line no-console
    console.log("Error reported:", errorDetails);
    alert("Error reported successfully! Our team will investigate this issue.");
  };

  return (
    <div className="from-background via-background to-destructive/5 relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, var(--color-destructive) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, var(--color-primary) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, var(--color-destructive) 0%, transparent 50%)
            `,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Interactive cursor effect */}
        <motion.div
          className="pointer-events-none absolute h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--color-destructive) 0%, transparent 70%)",
            opacity: 0.08,
          }}
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />

        {/* Floating warning symbols */}
        <FloatingSymbol>
          <AlertTriangle className="text-destructive/30 h-6 w-6" />
        </FloatingSymbol>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated Error Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mb-8"
          >
            <motion.div
              animate={controls}
              className="relative mx-auto mb-6 h-32 w-32"
            >
              <div className="from-destructive/20 to-destructive/10 border-destructive/30 relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border-2 bg-linear-to-r">
                <Bug className="text-destructive h-16 w-16" />

                {/* Glitch effect */}
                <motion.div
                  className="bg-destructive/10 absolute inset-0"
                  animate={{
                    x: [0, 2, -2, 0],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                />
              </div>

              {/* Pulsing glow */}
              <motion.div
                className="bg-destructive/20 absolute inset-0 rounded-3xl blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-4 text-6xl font-black sm:text-7xl md:text-8xl"
            >
              <span className="from-destructive via-destructive to-destructive/70 bg-linear-to-r bg-clip-text text-transparent">
                500
              </span>
            </motion.h1>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              Something went{" "}
              <span className="from-destructive to-destructive/70 bg-linear-to-r bg-clip-text text-transparent">
                wrong
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto mb-4 max-w-2xl text-lg leading-relaxed">
              Our servers encountered an unexpected error. Don&apos;t worry, our
              engineering team has been notified and is working on a fix.
            </p>

            {/* Error Details (if available) */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-destructive/5 border-destructive/20 mx-auto mt-6 max-w-2xl rounded-lg border p-4 text-left"
              >
                <p className="text-muted-foreground mb-2 text-sm">
                  Error Details:
                </p>
                <code className="text-destructive font-mono text-xs break-all">
                  {error.message}
                </code>
                {error.digest && (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Error ID: {error.digest}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {reset && (
              <Button
                size="lg"
                onClick={handleRetry}
                disabled={isRetrying}
                className="group px-8 py-6 text-lg font-semibold"
              >
                <RefreshCw
                  className={`mr-2 h-5 w-5 ${isRetrying ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-300`}
                />
                {isRetrying ? "Retrying..." : "Try Again"}
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="group px-8 py-6 text-lg font-semibold"
            >
              <Home className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Back to Home
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleReportError}
              className="group px-8 py-6 text-lg font-semibold"
            >
              <Mail className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Report Issue
            </Button>
          </motion.div>

          {/* Status Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mx-auto max-w-2xl"
          >
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: "System Status",
                  value: "Investigating",
                  color: "text-yellow-500",
                },
                {
                  label: "Response Time",
                  value: "< 2 min",
                  color: "text-green-500",
                },
                { label: "Uptime", value: "99.9%", color: "text-primary" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  className="bg-card border-border rounded-lg border p-4"
                >
                  <div className="text-muted-foreground mb-1 text-sm">
                    {stat.label}
                  </div>
                  <div className={`text-lg font-semibold ${stat.color}`}>
                    {stat.value}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="text-muted-foreground text-sm"
            >
              If the problem persists, please contact our support team at{" "}
              <a
                href="mailto:support@onchainsuite.com"
                className="text-primary hover:underline"
              >
                support@onchainsuite.com
              </a>
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <FloatingParticle particleNo={10} />
      </div>
    </div>
  );
}
