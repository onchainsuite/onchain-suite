"use client";

import * as React from "react";

interface UseKeyboardNavigationOptions {
  itemCount: number;
  onSelect: (index: number) => void;
  onEscape?: () => void;
  enabled?: boolean;
  loop?: boolean;
}

export function useKeyboardNavigation({
  itemCount,
  onSelect,
  onEscape,
  enabled = true,
  loop = true,
}: UseKeyboardNavigationOptions) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => {
            if (loop) {
              return (prev + 1) % itemCount;
            }
            return Math.min(prev + 1, itemCount - 1);
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => {
            if (loop) {
              return prev === 0 ? itemCount - 1 : prev - 1;
            }
            return Math.max(prev - 1, 0);
          });
          break;
        case "Enter":
          e.preventDefault();
          onSelect(selectedIndex);
          break;
        case "Escape":
          e.preventDefault();
          onEscape?.();
          break;
        case "Home":
          e.preventDefault();
          setSelectedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setSelectedIndex(itemCount - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, itemCount, selectedIndex, onSelect, onEscape, loop]);

  return {
    selectedIndex,
    setSelectedIndex,
  };
}
