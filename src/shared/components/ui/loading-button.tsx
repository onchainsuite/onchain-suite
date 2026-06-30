"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import type React from "react";

import { Button, type ButtonProps } from "@/ui/button";

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  loadingText?: string;
}

export function LoadingButton({
  isLoading,
  disabled = false,
  children,
  icon: Icon = ArrowRightIcon,
  className = "",
  type = "submit",
  loadingText,
  onClick,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      type={type}
      className={`group h-12 w-full ${className}`}
      disabled={isLoading || disabled}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="border-primary-foreground h-5 w-5 rounded-full border-2 border-t-transparent"
        />
      ) : (
        <>
          {loadingText ?? children}
          {!isLoading && (
            <Icon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </>
      )}
    </Button>
  );
}
