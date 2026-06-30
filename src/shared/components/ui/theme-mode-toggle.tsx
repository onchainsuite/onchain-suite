"use client";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <SunIcon
        className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "scale-0 rotate-90" : "scale-100 rotate-0"}`}
        aria-hidden="true"
      />
      <MoonIcon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}
        aria-hidden="true"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
