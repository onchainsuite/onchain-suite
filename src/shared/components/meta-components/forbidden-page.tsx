"use client";

import { motion, useAnimation } from "framer-motion";
import { AlertCircle, Home, Key, Lock, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FloatingParticle, FloatingSymbol } from "@/components/common";
import { Button } from "@/ui/button";

import { AUTH_ROUTES } from "@/config/app-routes";

export default function ForbiddenPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
      rotate: [0, 3, -3, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    });
  }, [controls]);

  return (
    <div className="from-background via-background relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br to-yellow-500/5">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, #f59e0b 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, var(--color-primary) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, #f59e0b 0%, transparent 50%)
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
            background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
            opacity: 0.08,
          }}
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />

        {/* Floating lock symbols */}
        <FloatingSymbol elementNo={8}>
          <Lock className="h-5 w-5 text-yellow-500/30" />
        </FloatingSymbol>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated Shield Icon */}
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
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-yellow-500/30 bg-linear-to-r from-yellow-500/20 to-yellow-500/10">
                <Shield className="h-16 w-16 text-yellow-500" />

                {/* Lock overlay */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Lock className="h-8 w-8 text-yellow-600" />
                </motion.div>
              </div>

              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-yellow-500/20 blur-xl"
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
              <span className="bg-linear-to-r from-yellow-500 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                403
              </span>
            </motion.h1>
          </motion.div>

          {/* Forbidden Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              Access{" "}
              <span className="bg-linear-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Denied
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg leading-relaxed">
              You don&apos;t have permission to access this resource. This area
              is restricted to authorized users only.
            </p>

            {/* Permission Info */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="inline-flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-6 py-3 text-yellow-700 dark:text-yellow-400"
            >
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Authentication Required</span>
            </motion.div>
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mx-auto mb-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {[
              {
                icon: Shield,
                title: "Secure Access",
                description: "Protected by enterprise-grade security",
                color: "text-blue-500",
                bg: "bg-blue-500/10 border-blue-500/20",
              },
              {
                icon: Key,
                title: "Authentication",
                description: "Valid credentials required",
                color: "text-green-500",
                bg: "bg-green-500/10 border-green-500/20",
              },
              {
                icon: Lock,
                title: "Encryption",
                description: "Data protected with AES-256",
                color: "text-purple-500",
                bg: "bg-purple-500/10 border-purple-500/20",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`rounded-xl border p-6 ${feature.bg} transition-all duration-300`}
              >
                <feature.icon
                  className={`h-8 w-8 ${feature.color} mx-auto mb-3`}
                />
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="group px-8 py-6 text-lg font-semibold"
            >
              <Link href={AUTH_ROUTES.LOGIN}>
                <Key className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                Sign In
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group px-8 py-6 text-lg font-semibold"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Back to Home
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="group px-8 py-6 text-lg font-semibold"
            >
              <Mail className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Request Access
            </Button>
          </motion.div>

          {/* Help Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mx-auto max-w-2xl"
          >
            <div className="bg-card border-border rounded-xl border p-6">
              <h3 className="mb-3 font-semibold">Need Help?</h3>
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground mb-2">
                    If you believe you should have access:
                  </p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Check your login credentials</li>
                    <li>• Contact your administrator</li>
                    <li>• Request permission upgrade</li>
                  </ul>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">
                    For immediate assistance:
                  </p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>
                      • Email:{" "}
                      <a
                        href="mailto:support@r3tain.com"
                        className="text-primary hover:underline"
                      >
                        support@r3tain.com
                      </a>
                    </li>
                    <li>• Phone: +1 (555) 123-4567</li>
                    <li>• Live Chat: Available 24/7</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <FloatingParticle particleNo={12} />
      </div>
    </div>
  );
}
