"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AdditionalIntegrationsProps {
  onFindMore: () => void;
}

export function AdditionalIntegrations({
  onFindMore,
}: AdditionalIntegrationsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="text-center"
    >
      <p className="text-muted-foreground mb-2">
        Need to connect something else?
      </p>
      <Button
        variant="link"
        onClick={onFindMore}
        className="text-primary hover:text-primary/80 h-auto p-0 font-normal"
      >
        Find more apps and integrations
        <ExternalLink className="ml-1 h-4 w-4" />
      </Button>
    </motion.div>
  );
}
