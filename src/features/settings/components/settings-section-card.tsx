"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { type ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";

interface SettingsSectionCardProps {
  title: string;
  description: string;
  children: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  collapsedPreview?: ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
}

export default function SettingsSectionCard({
  title,
  description,
  children,
  icon,
  badge,
  collapsedPreview,
  defaultOpen = false,
  onOpenChange,
  className,
  contentClassName,
}: SettingsSectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <Collapsible open={open} onOpenChange={handleOpenChange}>
      <Card
        className={cn(
          "overflow-hidden rounded-3xl border-border/60 bg-card/70 shadow-sm",
          className
        )}
      >
        <CardHeader className="p-0">
          <CollapsibleTrigger className="group w-full rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
            <div className="flex items-start justify-between gap-4 px-6 py-5">
              <div className="flex min-w-0 items-start gap-3">
                {icon ? (
                  <div className="mt-0.5 shrink-0 text-primary [&_svg]:h-6 [&_svg]:w-6">
                    {icon}
                  </div>
                ) : null}
                <div className="min-w-0">
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription className="mt-1 max-w-2xl">
                    {description}
                  </CardDescription>
                  {badge ? (
                    <div className="mt-3 text-xs font-medium text-muted-foreground">
                      {badge}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 text-muted-foreground">
                <span className="hidden text-xs font-medium uppercase tracking-[0.18em] sm:inline">
                  {open ? "Collapse" : "Expand"}
                </span>
                <div className="rounded-full border border-border/70 bg-background/80 p-2 transition-colors group-hover:border-primary/30 group-hover:text-foreground">
                  <ChevronDownIcon
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      open ? "rotate-180" : "rotate-0"
                    )}
                  />
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        {!open && collapsedPreview ? (
          <div className="border-t border-border/50 px-6 pb-5 pt-4">
            {collapsedPreview}
          </div>
        ) : null}

        <CollapsibleContent>
          <CardContent
            className={cn("border-t border-border/50 p-6", contentClassName)}
          >
            <motion.div
              initial="initial"
              animate="animate"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {children}
            </motion.div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
