"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

import { Button } from "@/ui/button";
import { LoadingButton } from "@/ui/loading-button";

interface ActionButtonsProps {
  onCancel: () => void;
  onComplete: () => void;
  isImporting: boolean;
  disabled: boolean;
}

export function ActionButtons({
  onCancel,
  onComplete,
  isImporting,
  disabled,
}: ActionButtonsProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="flex flex-col justify-center gap-4 pt-6 sm:flex-row"
    >
      <Button
        variant="outline"
        size="lg"
        onClick={onCancel}
        disabled={isImporting}
        className="bg-transparent px-8 py-3"
      >
        Cancel Import
      </Button>

      <LoadingButton
        size="lg"
        onClick={onComplete}
        disabled={disabled}
        isLoading={isImporting}
        loadingText="Importing Subscribers..."
        icon={CheckCircle}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 shadow-lg transition-all duration-300 hover:shadow-xl"
      >
        Complete Import
      </LoadingButton>
    </motion.div>
  );
}
