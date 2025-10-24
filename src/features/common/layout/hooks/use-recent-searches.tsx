"use client";

import { useCallback } from "react";

import { useLocalStorage } from "@/hooks/client";

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
}

export function useRecentSearches() {
  const { value: recentSearches, setValue: setRecentSearches } =
    useLocalStorage<RecentSearch[]>("recent-searches", []);

  const addRecentSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;

      const newSearch: RecentSearch = {
        id: `search-${Date.now()}`,
        query: query.trim(),
        timestamp: Date.now(),
      };

      setRecentSearches((prev) => {
        // Remove duplicate if exists
        const filtered = prev.filter(
          (item) => item.query.toLowerCase() !== query.toLowerCase()
        );
        // Add new search at the beginning and limit to 10
        return [newSearch, ...filtered].slice(0, 10);
      });
    },
    [setRecentSearches]
  );

  const removeRecentSearch = useCallback(
    (id: string) => {
      setRecentSearches((prev) => prev.filter((item) => item.id !== id));
    },
    [setRecentSearches]
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, [setRecentSearches]);

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
}
