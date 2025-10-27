"use client";

import { motion, useAnimation } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Key,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { FloatingParticle, FloatingSymbol } from "@/components/common";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentStep, setCurrentStep] = useState(0);
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
      rotate: [0, 2, -2, 0],
      scale: [1, 1.02, 1],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    });
  }, [controls]);

  const authSteps = [
    {
      icon: User,
      title: "Identity Verification",
      description: "Confirm your identity with our security team",
    },
    {
      icon: Shield,
      title: "Permission Review",
      description: "We'll review your access requirements",
    },
    {
      icon: CheckCircle,
      title: "Access Granted",
      description: "Get full access to authorized features",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      action: "support@r3tain.com",
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our team",
      action: "+1 (555) 123-4567",
      color: "text-green-500",
      bg: "bg-green-500/10 border-green-500/20",
    },
    {
      icon: Clock,
      title: "Live Chat",
      description: "Available 24/7",
      action: "Start Chat",
      color: "text-purple-500",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="from-background via-background relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br to-orange-500/5">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, #f97316 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, var(--color-primary) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, #f97316 0%, transparent 50%)
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

        {/* Dynamic grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(#f97316 1px, transparent 1px),
              linear-gradient(90deg, #f97316 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "50px 50px"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Interactive cursor effect */}
        <motion.div
          className="pointer-events-none absolute h-96 w-96 rounded-full"
          style={{
            background: "radial-gradient(circle, #f97316 0%, transparent 70%)",
            opacity: 0.08,
          }}
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />

        {/* Floating security symbols */}
        <FloatingSymbol>
          {Array.from({ length: 12 }).map((_, i) =>
            i % 3 === 0 ? (
              <Lock key={uuidv4()} className="h-4 w-4 text-orange-500/30" />
            ) : i % 3 === 1 ? (
              <Shield key={uuidv4()} className="h-4 w-4 text-orange-500/30" />
            ) : (
              <Key key={uuidv4()} className="h-4 w-4 text-orange-500/30" />
            )
          )}
        </FloatingSymbol>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Animated Security Shield */}
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
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-orange-500/30 bg-linear-to-r from-orange-500/20 to-orange-500/10">
                <Shield className="h-16 w-16 text-orange-500" />

                {/* Rotating lock overlay */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Lock className="h-6 w-6 text-orange-600/60" />
                </motion.div>

                {/* Security scan lines */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-b from-transparent via-orange-500/20 to-transparent"
                  animate={{
                    y: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Pulsing security perimeter */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-orange-500/40"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Orbiting security elements */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                {[0, 90, 180, 270].map((angle, i) => (
                  <motion.div
                    key={uuidv4()}
                    className="absolute h-3 w-3 rounded-full bg-orange-500/60"
                    style={{
                      left: "50%",
                      top: "50%",
                      transformOrigin: "0 0",
                      transform: `rotate(${angle}deg) translateX(80px) translateY(-6px)`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-4 text-6xl font-black sm:text-7xl md:text-8xl"
            >
              <span className="bg-linear-to-r from-orange-500 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                401
              </span>
            </motion.h1>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              Authentication{" "}
              <span className="bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Required
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed">
              You need to be authenticated to access this resource. Please sign
              in with your credentials or request access if you don&apos;t have
              an account yet.
            </p>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8 inline-flex items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/10 px-6 py-3 text-orange-700 dark:text-orange-400"
            >
              <Shield className="h-5 w-5" />
              <span className="font-medium">Secure Access Portal</span>
            </motion.div>
          </motion.div>

          {/* Authentication Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <h3 className="mb-8 text-xl font-semibold">How to Get Access</h3>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
              {authSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`relative cursor-pointer rounded-xl border p-6 transition-all duration-300 ${
                    currentStep === index
                      ? "border-orange-500/30 bg-orange-500/10 shadow-lg"
                      : "bg-card border-border hover:border-orange-500/20"
                  } `}
                  onClick={() => setCurrentStep(index)}
                >
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <step.icon className="mx-auto mb-4 h-8 w-8 text-orange-500" />
                  <h4 className="mb-2 font-semibold">{step.title}</h4>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>

                  {/* Progress indicator */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 rounded-b-xl bg-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: currentStep >= index ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Primary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" className="group px-8 py-6 text-lg font-semibold">
              <Key className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
              Sign In
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="group px-8 py-6 text-lg font-semibold"
            >
              <User className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Create Account
            </Button>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mb-12"
          >
            <h3 className="mb-6 text-lg font-semibold">
              Need Help Getting Access?
            </h3>
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className={`rounded-xl border p-4 ${method.bg} group cursor-pointer transition-all duration-300`}
                >
                  <method.icon
                    className={`h-6 w-6 ${method.color} mx-auto mb-3 transition-transform group-hover:scale-110`}
                  />
                  <h4 className="mb-1 font-medium">{method.title}</h4>
                  <p className="text-muted-foreground mb-2 text-xs">
                    {method.description}
                  </p>
                  <p className={`text-sm font-medium ${method.color}`}>
                    {method.action}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Security Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mx-auto max-w-3xl"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Security Features */}
              <div className="bg-card border-border rounded-xl border p-6">
                <Shield className="text-primary mb-4 h-8 w-8" />
                <h4 className="mb-3 font-semibold">Enterprise Security</h4>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Multi-factor authentication
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    SOC 2 Type II compliant
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Regular security audits
                  </li>
                </ul>
              </div>

              {/* Access Information */}
              <div className="bg-card border-border rounded-xl border p-6">
                <Key className="mb-4 h-8 w-8 text-orange-500" />
                <h4 className="mb-3 font-semibold">Access Levels</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Basic Access</span>
                    <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-600">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Premium Features
                    </span>
                    <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-600">
                      Requires Auth
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Admin Panel</span>
                    <span className="rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-600">
                      Restricted
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              className="bg-muted/50 mt-8 rounded-lg p-4 text-center"
            >
              <p className="text-muted-foreground text-sm">
                By accessing this system, you agree to our{" "}
                <a href="#terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                . For security questions, contact{" "}
                <a
                  href="mailto:security@r3tain.com"
                  className="text-primary hover:underline"
                >
                  security@r3tain.com
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <FloatingParticle particleNo={20} />
      </div>

      {/* Ambient security lighting */}
      <motion.div
        className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl"
        style={{
          backgroundColor: "color-mix(in srgb, #f97316 10%, transparent)",
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
    </div>
  );
}
