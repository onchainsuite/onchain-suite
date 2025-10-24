"use client";

import { useCallback } from "react";

import { useLocalStorage } from "@/hooks/client";

export interface FavoriteItem {
  id: string;
  title: string;
  href: string;
  icon?: string;
  timestamp: number;
}

export function useFavorites() {
  const { value: favorites, setValue: setFavorites } = useLocalStorage<
    FavoriteItem[]
  >("dashboard-favorites", []);

  const addFavorite = useCallback(
    (item: Omit<FavoriteItem, "timestamp">) => {
      const newFavorite: FavoriteItem = {
        ...item,
        timestamp: Date.now(),
      };
      setFavorites((prev) => {
        // Check if already favorited
        if (prev.some((fav) => fav.id === item.id)) {
          return prev;
        }
        return [newFavorite, ...prev];
      });
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.some((fav) => fav.id === id);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (item: Omit<FavoriteItem, "timestamp">) => {
      if (isFavorite(item.id)) {
        removeFavorite(item.id);
      } else {
        addFavorite(item);
      }
    },
    [isFavorite, removeFavorite, addFavorite]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}
