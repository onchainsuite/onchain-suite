"use client";

import { PanelLeftIcon, Star, X } from "lucide-react";
import React from "react";

import { Logo } from "@/components/common";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

import { PLATFORM_NAVIGATION } from "../config/nav-items";
import { type SidebarNavItem } from "../types";
import { HelpTooltip } from "./help-tooltip";
import { NavItem } from "./sidebar/nav-item"; // Import NavItem component
import { SubmenuPanel } from "./sidebar/submenu-panel";
import {
  useFavorites,
  useRecentItems,
  useSidebar,
} from "@/common/layout/hooks";

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function DashboardSidebar({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const {
    hoveredItem,
    expandedNestedItems,
    submenuPosition,
    submenuRef,
    focusedItemIndex,
    toggleNestedSubmenu,
    handleItemClick,
    handleItemHover,
    handleItemLeave,
    handlePanelEnter,
    handlePanelLeave,
    handleKeyDown,
    setItemRef,
  } = useSidebar({ isCollapsed, isMobileOpen });

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { addRecentItem } = useRecentItems();

  const navItemTitles = React.useMemo(
    () => PLATFORM_NAVIGATION.map((item) => item.title),
    []
  );

  const handleNavItemClick = React.useCallback(
    (item: SidebarNavItem) => {
      // Add to recent items if it has an href
      if (item.href) {
        addRecentItem({
          id: item.href,
          title: item.title,
          href: item.href,
        });
      }
      handleItemClick(item.title, !!item.submenu);
    },
    [addRecentItem, handleItemClick]
  );

  const handleToggleFavorite = React.useCallback(
    (e: React.MouseEvent, item: { title: string; href?: string }) => {
      e.stopPropagation();
      if (item.href) {
        toggleFavorite({
          id: item.href,
          title: item.title,
          href: item.href,
        });
      }
    },
    [toggleFavorite]
  );

  const handleNavKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      handleKeyDown(e.nativeEvent as KeyboardEvent, navItemTitles);
    },
    [handleKeyDown, navItemTitles]
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          onKeyDown={(e) => e.key === "Escape" && onMobileClose()}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <Logo />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMobileClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className="p-2" aria-label="Primary navigation">
              <TooltipProvider delayDuration={0}>
                {!isCollapsed && favorites.length > 0 && (
                  <div className="mb-4">
                    <div className="mb-2 px-3 flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Favorites
                      </span>
                      <HelpTooltip
                        content="Your favorite pages for quick access. Click the star icon on any page to add it here."
                        side="right"
                      />
                    </div>
                    <ul className="space-y-1" role="list">
                      {favorites.slice(0, 5).map((item) => (
                        <li key={item.id} className="group relative">
                          <a
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
                          >
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            <span className="flex-1 truncate">
                              {item.title}
                            </span>
                          </a>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleToggleFavorite(e, item)}
                            aria-label={`Remove ${item.title} from favorites`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <ul className="space-y-1" role="list">
                  {PLATFORM_NAVIGATION.map((item, index) => (
                    <div key={item.title} className="group relative">
                      <NavItem
                        title={item.title}
                        icon={item.icon}
                        href={item.href}
                        isActive={item.title === "Marketing"}
                        isCollapsed={isCollapsed}
                        hasSubmenu={!!item.submenu}
                        isFocused={focusedItemIndex === index}
                        onClick={() => handleNavItemClick(item)}
                        onMouseEnter={() =>
                          item.submenu && handleItemHover(item.title)
                        }
                        onMouseLeave={() => item.submenu && handleItemLeave()}
                        onKeyDown={handleNavKeyDown}
                        itemRef={(el) => setItemRef(item.title, el)}
                      />
                      {!isCollapsed && item.href && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => handleToggleFavorite(e, item)}
                          aria-label={
                            isFavorite(item.href)
                              ? `Remove ${item.title} from favorites`
                              : `Add ${item.title} to favorites`
                          }
                        >
                          <Star
                            className={cn(
                              "h-3 w-3",
                              isFavorite(item.href)
                                ? "fill-current text-yellow-500"
                                : "text-muted-foreground"
                            )}
                          />
                        </Button>
                      )}
                    </div>
                  ))}
                </ul>
              </TooltipProvider>
            </nav>
          </ScrollArea>

          {/* Collapse Button */}
          <div className="border-t border-sidebar-border p-2">
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "sm"}
              onClick={onToggle}
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar items-center"
              aria-label={
                isCollapsed ? "Expand navigation" : "Collapse navigation"
              }
            >
              <PanelLeftIcon
                className={cn("size-5", isCollapsed && "mx-auto")}
              />
              {!isCollapsed && <span>Collapse the navigation</span>}
            </Button>
          </div>
        </div>

        {hoveredItem &&
          PLATFORM_NAVIGATION.find((item) => item.title === hoveredItem)
            ?.submenu && (
            <SubmenuPanel
              title={hoveredItem}
              items={
                PLATFORM_NAVIGATION.find((item) => item.title === hoveredItem)
                  ?.submenu ?? []
              }
              isCollapsed={isCollapsed}
              position={submenuPosition}
              expandedItems={expandedNestedItems}
              onToggleNested={toggleNestedSubmenu}
              onMouseEnter={handlePanelEnter}
              onMouseLeave={handlePanelLeave}
              panelRef={submenuRef}
            />
          )}
      </aside>
    </>
  );
}
