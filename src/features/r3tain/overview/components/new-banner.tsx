"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export function NewUserBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="border-border border-b bg-[#fef3c7] px-6 py-3 dark:bg-[#451a03]">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-[#d97706]" />
          <p className="text-sm text-[#92400e] dark:text-[#fbbf24]">
            <span className="font-medium">
              Your account requires additional verification.
            </span>{" "}
            Check our{" "}
            <button className="underline hover:no-underline">
              Compliance page
            </button>{" "}
            for more details.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="rounded-md p-1 text-[#92400e] hover:bg-[#fde68a] dark:text-[#fbbf24] dark:hover:bg-[#78350f]"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </button>
      </div>
    </div>
  );
}
