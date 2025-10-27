/* eslint-disable no-console */
"use client";

import {
  Bookmark,
  Clock,
  FileText,
  Grid3x3,
  HelpCircle,
  Home,
  Keyboard,
  Moon,
  Plus,
  Settings,
  ShoppingCart,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import {
  useFavorites,
  useKeyboardShortcuts,
  useRecentItems,
} from "@/common/layout/hooks";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: (path: string) => void;
  onToggleSidebar?: () => void;
  onOpenSettings?: () => void;
  onOpenAssistant?: () => void;
  onCreateNew?: () => void;
  onShowShortcuts?: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
  onToggleSidebar,
  onOpenSettings,
  onOpenAssistant,
  onCreateNew,
  onShowShortcuts,
}: CommandPaletteProps) {
  const { theme, setTheme } = useTheme();
  const { getModifierKey } = useKeyboardShortcuts();
  const { favorites, removeFavorite } = useFavorites();
  const { recentItems, clearRecentItems } = useRecentItems();

  const runCommand = React.useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange]
  );

  const handleRemoveFavorite = React.useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      removeFavorite(id);
    },
    [removeFavorite]
  );

  const handleClearRecent = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      clearRecentItems();
    },
    [clearRecentItems]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {favorites.length > 0 && (
          <>
            <CommandGroup heading="Favorites">
              {favorites.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(() => onNavigate?.(item.href))}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span>{item.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-60 hover:opacity-100"
                    onClick={(e) => handleRemoveFavorite(e, item.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {recentItems.length > 0 && (
          <>
            <CommandGroup
              heading={
                <div className="flex items-center justify-between">
                  <span>Recent</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 px-2 text-xs opacity-60 hover:opacity-100"
                    onClick={handleClearRecent}
                  >
                    Clear
                  </Button>
                </div>
              }
            >
              {recentItems.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(() => onNavigate?.(item.href))}
                >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => runCommand(() => onCreateNew?.())}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create New</span>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => onOpenAssistant?.())}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Open AI Assistant</span>
            </div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">{getModifierKey()}</span>
              <span className="text-xs">⇧</span>A
            </kbd>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => onOpenSettings?.())}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Open Settings</span>
            </div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">{getModifierKey()}</span>.
            </kbd>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => onNavigate?.("/"))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => onNavigate?.("/bookmarks"))}
          >
            <Bookmark className="mr-2 h-4 w-4" />
            <span>Bookmarks</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onNavigate?.("/crm"))}>
            <Grid3x3 className="mr-2 h-4 w-4" />
            <span>CRM</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => onNavigate?.("/marketing"))}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Marketing</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => onNavigate?.("/content"))}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Content</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => onNavigate?.("/sales"))}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Sales</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="View">
          <CommandItem
            onSelect={() => runCommand(() => onToggleSidebar?.())}
            className="flex items-center justify-between"
          >
            <span>Toggle Sidebar</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">{getModifierKey()}</span>B
            </kbd>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))
            }
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle Theme</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Help">
          <CommandItem
            onSelect={() => runCommand(() => onShowShortcuts?.())}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              <span>Keyboard Shortcuts</span>
            </div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">{getModifierKey()}</span>/
            </kbd>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => console.log("Open help"))}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help Center</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
