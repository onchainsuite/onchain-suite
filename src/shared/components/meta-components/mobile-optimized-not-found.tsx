"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";

import { publicRoutes } from "@/config/app-routes";

export default function MobileOptimizedNotFound() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simple fallback for SSR
  if (!isClient) {
    return (
      <div className="from-background to-primary/5 flex min-h-screen items-center justify-center bg-linear-to-br p-4">
        <div className="mx-auto max-w-md text-center">
          <div className="text-primary mb-6 text-6xl font-black">404</div>
          <h1 className="mb-4 text-2xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href={publicRoutes.HOME}>
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="from-background to-primary/5 relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br p-4">
      {/* Simplified background for mobile */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 30% 70%, var(--color-primary) 0%, transparent 60%)",
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Large 404 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="from-primary via-primary to-primary/70 bg-linear-to-r bg-clip-text text-7xl leading-none font-black text-transparent sm:text-8xl">
              404
            </h1>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="mb-4 text-xl font-bold sm:text-2xl">
              Page not found
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 space-y-3"
          >
            <Button size="lg" className="group w-full">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <Button variant="outline" size="lg" className="group w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <p className="text-muted-foreground mb-4 text-sm">
              Or search for what you need:
            </p>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <input
                type="text"
                placeholder="Search..."
                className="border-border bg-background focus:ring-primary/20 focus:border-primary w-full rounded-lg border py-3 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none"
              />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-muted-foreground mb-4 text-sm">Quick links:</p>
            <div className="grid grid-cols-2 gap-2">
              {["Features", "Pricing", "Docs", "Support"].map((link, index) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-muted/50 hover:bg-primary/10 border-border rounded-lg border p-3 text-sm font-medium transition-all"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Minimal floating elements for mobile */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={uuidv4()}
            className="bg-primary/20 absolute h-1 w-1 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: "100%",
            }}
            animate={{
              y: [-10, -200],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
