"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Bowser from "bowser";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface SearchTriggerProps {
  onClick: () => void;
}

export function SearchTrigger({ onClick }: SearchTriggerProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const browser = Bowser.getParser(window.navigator.userAgent);

    setIsMac(browser.getOS().name === "macOS");
  }, []);

  return (
    <Button
      variant="outline"
      className="bg-muted/50 text-muted-foreground relative h-9 w-auto justify-start rounded-md text-sm font-normal shadow-none sm:pr-12 md:w-40 lg:w-64"
      onClick={onClick}
    >
      <HugeiconsIcon icon={Search01Icon} className="mr-2 h-4 w-4" />
      <span className="hidden lg:inline-flex">Search...</span>
      <span className="inline-flex lg:hidden">Search...</span>
      <kbd className="bg-muted pointer-events-none absolute top-2 right-1.5 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
        <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
      </kbd>
    </Button>
  );
}
