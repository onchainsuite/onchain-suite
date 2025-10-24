"use client";

import { Lightbulb, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface QuickTipProps {
  title: string;
  description: string;
  onDismiss: () => void;
  className?: string;
}

export function QuickTip({
  title,
  description,
  onDismiss,
  className,
}: QuickTipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border bg-card p-4 shadow-lg transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={handleDismiss}
        aria-label="Dismiss tip"
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="flex gap-3 pr-6">
        <div className="shrink-0 mt-0.5">
          <div className="rounded-full bg-primary/10 p-2">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
