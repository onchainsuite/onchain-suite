"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { useLocalStorage } from "@/hooks/client";

import { useKeyboardShortcuts } from "./use-keyboard-shortcuts";

export function useDashboardLayout() {
  const { value: isCollapsed, setValue: setIsCollapsed } = useLocalStorage(
    "sidebar-collapsed",
    false
  );
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = React.useState(false);
  const [mobileNotificationsOpen, setMobileNotificationsOpen] =
    React.useState(false);
  const [preferencesDialogOpen, setPreferencesDialogOpen] =
    React.useState(false);
  const { checkModifier } = useKeyboardShortcuts();
  const { theme, setTheme } = useTheme();

  const toggleSidebar = React.useCallback(
    () => setIsCollapsed(!isCollapsed),
    [isCollapsed, setIsCollapsed]
  );
  const toggleMobileMenu = React.useCallback(
    () => setIsMobileOpen((prev) => !prev),
    []
  );
  const closeMobileMenu = React.useCallback(() => setIsMobileOpen(false), []);
  const openCommandPalette = React.useCallback(
    () => setCommandPaletteOpen(true),
    []
  );
  const openShortcutsDialog = React.useCallback(
    () => setShortcutsDialogOpen(true),
    []
  );
  const openPreferencesDialog = React.useCallback(
    () => setPreferencesDialogOpen(true),
    []
  );

  const handleNavigate = React.useCallback((path: string) => {
    console.log("[v0] Navigate to:", path);
  }, []);

  const handleOpenSettings = React.useCallback(() => {
    setCommandPaletteOpen(false);
    setPreferencesDialogOpen(true);
  }, []);

  const handleOpenAssistant = React.useCallback(() => {
    console.log("[v0] Open AI assistant");
  }, []);

  const handleCreateNew = React.useCallback(() => {
    console.log("[v0] Create new");
  }, []);

  const handleShowShortcuts = React.useCallback(() => {
    setCommandPaletteOpen(false);
    setShortcutsDialogOpen(true);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const toggleMobileNotifications = React.useCallback(
    () => setMobileNotificationsOpen((prev) => !prev),
    []
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+J: Open command palette
      if (checkModifier(e) && e.key === "j") {
        e.preventDefault();
        openCommandPalette();
      }

      // /: Quick search (when not in input)
      if (e.key === "/" && !checkModifier(e) && !e.shiftKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (
          target.tagName !== "INPUT" &&
          target.tagName !== "TEXTAREA" &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          openCommandPalette();
        }
      }

      // Cmd/Ctrl+B: Toggle sidebar
      if (checkModifier(e) && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }

      // Cmd/Ctrl+.: Open settings
      if (checkModifier(e) && e.key === ".") {
        e.preventDefault();
        openPreferencesDialog();
      }

      // Cmd/Ctrl+Shift+A: Open AI assistant
      if (checkModifier(e) && e.shiftKey && e.key === "A") {
        e.preventDefault();
        handleOpenAssistant();
      }

      // Cmd/Ctrl+/: Show keyboard shortcuts
      if (checkModifier(e) && e.key === "/") {
        e.preventDefault();
        openShortcutsDialog();
      }

      // Cmd/Ctrl+Shift+?: Show keyboard shortcuts (alternative)
      if (checkModifier(e) && e.shiftKey && e.key === "?") {
        e.preventDefault();
        openShortcutsDialog();
      }

      // Cmd/Ctrl+Shift+T: Toggle theme
      if (checkModifier(e) && e.shiftKey && e.key === "T") {
        e.preventDefault();
        toggleTheme();
      }

      // Cmd/Ctrl+Shift+N: Toggle mobile notifications
      if (checkModifier(e) && e.shiftKey && e.key === "N") {
        e.preventDefault();
        toggleMobileNotifications();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    checkModifier,
    openCommandPalette,
    toggleSidebar,
    openPreferencesDialog,
    handleOpenAssistant,
    openShortcutsDialog,
    toggleTheme,
    toggleMobileNotifications,
  ]);

  return {
    // State
    isCollapsed,
    isMobileOpen,
    commandPaletteOpen,
    shortcutsDialogOpen,
    mobileNotificationsOpen,
    preferencesDialogOpen,
    // State setters
    setCommandPaletteOpen,
    setShortcutsDialogOpen,
    setMobileNotificationsOpen,
    setPreferencesDialogOpen,
    // Actions
    toggleSidebar,
    toggleMobileMenu,
    closeMobileMenu,
    openShortcutsDialog,
    toggleMobileNotifications,
    openPreferencesDialog,
    handleNavigate,
    handleOpenSettings,
    handleOpenAssistant,
    handleCreateNew,
    handleShowShortcuts,
  };
}
