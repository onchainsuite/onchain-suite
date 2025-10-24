"use client";

import { useSessionStorage } from "@/hooks/client";

export interface QuickTip {
  id: string;
  title: string;
  description: string;
  feature: string;
  dismissed: boolean;
}

const defaultTips: QuickTip[] = [
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    description:
      "Press ⌘J to open the command palette and quickly navigate anywhere.",
    feature: "command-palette",
    dismissed: false,
  },
  {
    id: "favorites",
    title: "Favorite Pages",
    description:
      "Click the star icon next to any page to add it to your favorites for quick access.",
    feature: "favorites",
    dismissed: false,
  },
  {
    id: "search",
    title: "Smart Search",
    description:
      "Use the search bar to quickly find pages. Your recent searches are saved for convenience.",
    feature: "search",
    dismissed: false,
  },
  {
    id: "notifications",
    title: "Stay Updated",
    description:
      "Check the notification center for important updates and mentions.",
    feature: "notifications",
    dismissed: false,
  },
];

export function useQuickTips() {
  const { value: tips, setValue: setTips } = useSessionStorage<QuickTip[]>(
    "quick-tips",
    defaultTips
  );

  const dismissTip = (tipId: string) => {
    const updatedTips = tips.map((tip) =>
      tip.id === tipId ? { ...tip, dismissed: true } : tip
    );
    setTips(updatedTips);
  };

  const resetTips = () => {
    setTips(defaultTips);
  };

  const getTipForFeature = (feature: string) => {
    return tips.find((tip) => tip.feature === feature && !tip.dismissed);
  };

  const activeTips = tips.filter((tip) => !tip.dismissed);

  return {
    tips,
    activeTips,
    dismissTip,
    resetTips,
    getTipForFeature,
  };
}
