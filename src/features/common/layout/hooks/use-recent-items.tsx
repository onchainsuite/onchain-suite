"use client";

import { useCallback } from "react";

import { useLocalStorage } from "@/hooks/client";

export interface RecentItem {
  id: string;
  title: string;
  href: string;
  icon?: string;
  timestamp: number;
}

const MAX_RECENT_ITEMS = 10;

export function useRecentItems() {
  const { value: recentItems, setValue: setRecentItems } = useLocalStorage<
    RecentItem[]
  >("dashboard-recent-items", []);

  const addRecentItem = useCallback(
    (item: Omit<RecentItem, "timestamp">) => {
      const newItem: RecentItem = {
        ...item,
        timestamp: Date.now(),
      };
      setRecentItems((prev) => {
        // Remove if already exists
        const filtered = prev.filter((recent) => recent.id !== item.id);
        // Add to beginning and limit to MAX_RECENT_ITEMS
        return [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
      });
    },
    [setRecentItems]
  );

  const clearRecentItems = useCallback(() => {
    setRecentItems([]);
  }, [setRecentItems]);

  return {
    recentItems,
    addRecentItem,
    clearRecentItems,
  };
}
