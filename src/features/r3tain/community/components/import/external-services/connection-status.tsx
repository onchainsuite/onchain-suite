"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConnectionStatusProps {
  connectedServices: string[];
  lastConnected?: string;
}

export function ConnectionStatus({
  connectedServices,
  lastConnected,
}: ConnectionStatusProps) {
  if (connectedServices.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <p className="mb-1 font-medium">
              {connectedServices.length} service
              {connectedServices.length !== 1 ? "s" : ""} connected
              successfully!
            </p>
            {lastConnected && (
              <p className="text-sm">
                Your subscribers will automatically sync from {lastConnected}{" "}
                and other connected services.
              </p>
            )}
          </AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}
