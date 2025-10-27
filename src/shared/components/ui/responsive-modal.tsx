"use client";

import type React from "react";
import { createContext, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

interface ResponsiveModalContextType {
  isOpen: boolean;
  onClose: () => void;
}

const ResponsiveModalContext = createContext<ResponsiveModalContextType | null>(
  null
);

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveModalContentProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

interface ResponsiveModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

// Hook to use modal context
const useResponsiveModal = () => {
  const context = useContext(ResponsiveModalContext);
  if (!context) {
    throw new Error(
      "ResponsiveModal components must be used within ResponsiveModal"
    );
  }
  return context;
};

// Main modal component
export function ResponsiveModal({
  isOpen,
  onClose,
  children,
  className,
}: ResponsiveModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <ResponsiveModalContext.Provider value={{ isOpen, onClose }}>
      <div
        ref={modalRef}
        className={cn(
          // Base overlay styles
          "fixed inset-0 z-50 flex",
          // Glassy overlay with backdrop blur
          "bg-background/80 backdrop-blur-sm",
          // Animation classes
          "animate-in fade-in-0 duration-300",
          // Mobile: drawer from bottom
          "md:items-center md:justify-center",
          "items-end justify-center",
          className
        )}
        onClick={handleBackdropClick}
        onKeyDown={(e) => {
          if (
            e.target === e.currentTarget &&
            (e.key === "Enter" || e.key === " ")
          ) {
            onClose();
          }
        }}
        role="dialog"
        aria-modal="true"
        tabIndex={0}
      >
        {children}
      </div>
    </ResponsiveModalContext.Provider>
  );

  return createPortal(modalContent, document.body);
}

// Modal content wrapper
export function ResponsiveModalContent({
  children,
  className,
  size = "md",
}: ResponsiveModalContentProps) {
  const sizeClasses = {
    sm: "md:max-w-sm",
    md: "md:max-w-md",
    lg: "md:max-w-lg",
    xl: "md:max-w-xl",
    full: "md:max-w-full md:max-h-full",
  };

  return (
    <div
      className={cn(
        // Base styles
        "relative max-h-[85vh] w-full overflow-hidden",
        "bg-background border-border border shadow-lg",
        // Mobile: drawer styles (bottom sheet)
        "rounded-t-xl md:rounded-xl",
        "animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0",
        "md:animate-in md:zoom-in-95 md:fade-in-0",
        "duration-300 ease-out",
        // Desktop: modal styles
        "md:max-h-[90vh] md:min-w-[400px]",
        sizeClasses[size],
        // Focus styles
        "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none",
        className
      )}
      tabIndex={-1}
    >
      {/* Mobile drag indicator */}
      <div className="flex justify-center pt-3 pb-2 md:hidden">
        <div className="bg-muted-foreground/30 h-1 w-8 rounded-full" />
      </div>
      {children}
    </div>
  );
}

// Modal header
export function ResponsiveModalHeader({
  children,
  className,
}: ResponsiveModalHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-6 pb-4",
        "border-border border-b",
        className
      )}
    >
      {children}
    </div>
  );
}

// Modal body
export function ResponsiveModalBody({
  children,
  className,
}: ResponsiveModalBodyProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-6",
        "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
        className
      )}
    >
      {children}
    </div>
  );
}

// Modal footer
export function ResponsiveModalFooter({
  children,
  className,
}: ResponsiveModalFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 p-6 pt-4",
        "border-border border-t",
        "bg-muted/30",
        className
      )}
    >
      {children}
    </div>
  );
}

// Close button component
export function ResponsiveModalClose({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { onClose } = useResponsiveModal();

  return (
    <button
      onClick={onClose}
      className={cn(
        "inline-flex items-center justify-center",
        "h-8 w-8 rounded-md",
        "text-muted-foreground hover:text-foreground",
        "hover:bg-muted transition-colors",
        "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none",
        className
      )}
      aria-label="Close modal"
    >
      {children ?? (
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}

// Title component
export function ResponsiveModalTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-lg leading-none font-semibold tracking-tight",
        "text-foreground",
        className
      )}
    >
      {children}
    </h2>
  );
}

// Description component
export function ResponsiveModalDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-muted-foreground mt-2 text-sm", className)}>
      {children}
    </p>
  );
}
