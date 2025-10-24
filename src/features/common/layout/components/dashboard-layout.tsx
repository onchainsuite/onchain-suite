"use client";

import {
  HelpCircle,
  Phone,
  Plus,
  Settings,
  Sparkles,
  Video,
} from "lucide-react";
import type * as React from "react";
import { useEffect, useState } from "react";

import { FloatingDock } from "@/ui/floating-dock";

import { cn } from "@/lib/utils";

import { type BreadcrumbItem, Breadcrumbs } from "./breadcrumbs";
import { CommandPalette } from "./command-palette";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog";
import { NotificationsBellIcon, NotificationsCenter } from "./notifications";
import { PreferencesDialog } from "./preferences-dialog";
import { QuickTip } from "./quick-tip";
import { useDashboardLayout, useQuickTips } from "@/common/layout/hooks";

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

const DOCK_ITEMS = [
  {
    title: "Create",
    icon: <Plus className="h-full w-full text-foreground" />,
    href: "#",
  },
  {
    title: "Upgrade",
    icon: <HelpCircle className="h-full w-full text-foreground" />,
    href: "#",
  },
  {
    title: "Call",
    icon: <Phone className="h-full w-full text-foreground" />,
    href: "#",
  },
  {
    title: "Video",
    icon: <Video className="h-full w-full text-foreground" />,
    href: "#",
  },
  {
    title: "Help",
    icon: <HelpCircle className="h-full w-full text-foreground" />,
    href: "#",
  },
  {
    title: "Settings",
    icon: <Settings className="h-full w-full text-foreground" />,
    href: "#",
  },
  {
    title: "Notifications",
    icon: <NotificationsBellIcon className="text-foreground" />,
    href: "#",
  },
  {
    title: "Assistant",
    icon: <Sparkles className="h-full w-full text-foreground" />,
    href: "#",
  },
];

export function DashboardLayout({
  children,
  breadcrumbs,
}: DashboardLayoutProps) {
  const {
    isCollapsed,
    isMobileOpen,
    commandPaletteOpen,
    shortcutsDialogOpen,
    mobileNotificationsOpen,
    preferencesDialogOpen,
    setCommandPaletteOpen,
    setShortcutsDialogOpen,
    setMobileNotificationsOpen,
    setPreferencesDialogOpen,
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
  } = useDashboardLayout();

  const { activeTips, dismissTip } = useQuickTips();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (activeTips.length > 0) {
      const timer = setTimeout(() => {
        setShowTip(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeTips]);

  const handleDismissTip = () => {
    if (activeTips[currentTipIndex]) {
      dismissTip(activeTips[currentTipIndex].id);
      setShowTip(false);

      // Show next tip after a delay
      if (currentTipIndex < activeTips.length - 1) {
        setTimeout(() => {
          setCurrentTipIndex(currentTipIndex + 1);
          setShowTip(true);
        }, 5000);
      }
    }
  };

  const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0;

  const handleDockItemClick = (title: string) => {
    if (title === "Notifications") {
      toggleMobileNotifications();
    }
    if (title === "Settings") {
      openPreferencesDialog();
    }
  };

  return (
    <div className="relative min-h-screen">
      <DashboardSidebar
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={isMobileOpen}
        onMobileClose={closeMobileMenu}
      />
      <DashboardHeader
        isCollapsed={isCollapsed}
        onMobileMenuToggle={toggleMobileMenu}
        onShowShortcuts={openShortcutsDialog}
      />

      {hasBreadcrumbs && (
        <div
          className={cn(
            "fixed top-16 right-0 z-20 h-12 border-b border-border/50",
            "bg-linear-to-r from-sidebar via-sidebar-accent to-sidebar",
            "backdrop-blur-sm supports-backdrop-filter:bg-linear-to-r supports-backdrop-filter:from-sidebar/90 supports-backdrop-filter:via-sidebar-accent/90 supports-backdrop-filter:to-sidebar/90",
            "transition-all duration-300",
            isCollapsed ? "left-16" : "left-64",
            "max-lg:left-0"
          )}
        >
          <div className="flex h-full items-center px-6">
            <Breadcrumbs
              items={breadcrumbs}
              className="text-sidebar-foreground/90"
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          "transition-all duration-300",
          hasBreadcrumbs ? "pt-28" : "pt-16",
          isCollapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        <main>{children}</main>
      </div>

      {showTip && activeTips[currentTipIndex] && (
        <div className="fixed bottom-24 right-6 z-40 max-w-sm lg:bottom-6">
          <QuickTip
            title={activeTips[currentTipIndex].title}
            description={activeTips[currentTipIndex].description}
            onDismiss={handleDismissTip}
          />
        </div>
      )}

      {/* Floating Dock for mobile/tablet */}
      <div className="fixed bottom-6 right-6 z-50 md:left-1/2 md:-translate-x-1/2 md:right-auto lg:hidden">
        <FloatingDock
          items={DOCK_ITEMS}
          mobileClassName=""
          onItemClick={handleDockItemClick}
        />
      </div>

      {/* Mobile Notifications Drawer */}
      <div className="lg:hidden">
        <NotificationsCenter
          mobile
          open={mobileNotificationsOpen}
          onOpenChange={setMobileNotificationsOpen}
        />
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onNavigate={handleNavigate}
        onToggleSidebar={toggleSidebar}
        onOpenSettings={handleOpenSettings}
        onOpenAssistant={handleOpenAssistant}
        onCreateNew={handleCreateNew}
        onShowShortcuts={handleShowShortcuts}
      />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={shortcutsDialogOpen}
        onOpenChange={setShortcutsDialogOpen}
      />

      {/* Preferences Dialog */}
      <PreferencesDialog
        open={preferencesDialogOpen}
        onOpenChange={setPreferencesDialogOpen}
      />
    </div>
  );
}
