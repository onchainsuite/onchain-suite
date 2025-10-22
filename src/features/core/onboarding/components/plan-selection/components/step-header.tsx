"use client";

import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface StepHeaderProps {
  onBack: () => void;
}

export function StepHeader({ onBack }: StepHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>
      <h1 className="text-foreground mb-2 text-2xl font-bold sm:text-3xl">
        Almost there! Choose the plan that&apos;s right for you.
      </h1>
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Selection</span>
        <span>→</span>
        <span>Payment</span>
        <span>→</span>
        <span>Confirmation</span>
      </div>
    </div>
  );
}
