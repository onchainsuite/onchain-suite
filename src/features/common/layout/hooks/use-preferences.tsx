"use client";

import { useLocalStorage } from "@/hooks/client";

export interface UserPreferences {
  notifications: {
    enabled: boolean;
    showBadges: boolean;
    playSound: boolean;
  };
  display: {
    compactMode: boolean;
    showAvatars: boolean;
    animationsEnabled: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
  };
}

const defaultPreferences: UserPreferences = {
  notifications: {
    enabled: true,
    showBadges: true,
    playSound: false,
  },
  display: {
    compactMode: false,
    showAvatars: true,
    animationsEnabled: true,
  },
  accessibility: {
    reduceMotion: false,
    highContrast: false,
  },
};

export function usePreferences() {
  const { value: preferences, setValue: setPreferences } =
    useLocalStorage<UserPreferences>("user-preferences", defaultPreferences);

  const updateNotificationPreferences = (
    updates: Partial<UserPreferences["notifications"]>
  ) => {
    setPreferences({
      ...preferences,
      notifications: { ...preferences.notifications, ...updates },
    });
  };

  const updateDisplayPreferences = (
    updates: Partial<UserPreferences["display"]>
  ) => {
    setPreferences({
      ...preferences,
      display: { ...preferences.display, ...updates },
    });
  };

  const updateAccessibilityPreferences = (
    updates: Partial<UserPreferences["accessibility"]>
  ) => {
    setPreferences({
      ...preferences,
      accessibility: { ...preferences.accessibility, ...updates },
    });
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return {
    preferences,
    updateNotificationPreferences,
    updateDisplayPreferences,
    updateAccessibilityPreferences,
    resetPreferences,
  };
}
