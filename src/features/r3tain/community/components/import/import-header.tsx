"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ImportHeaderProps {
  onBack: () => void;
  onExit: () => void;
}

export function ImportHeader({ onBack, onExit }: ImportHeaderProps) {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card/95 border-border sticky top-0 z-50 border-b p-4 backdrop-blur-sm lg:p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Sparkles className="text-primary-foreground h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Add Subscribers</h1>
              <p className="text-muted-foreground hidden text-sm sm:block">
                Choose Method
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={onExit}
          className="text-muted-foreground hover:text-foreground"
        >
          Exit
        </Button>
      </div>
    </motion.header>
  );
}
