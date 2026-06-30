"use client";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CheckCircleIcon className="size-4" aria-hidden="true" />,
        info: <InformationCircleIcon className="size-4" aria-hidden="true" />,
        warning: (
          <ExclamationTriangleIcon className="size-4" aria-hidden="true" />
        ),
        error: <StopIcon className="size-4" aria-hidden="true" />,
        loading: (
          <ArrowPathIcon className="size-4 animate-spin" aria-hidden="true" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
