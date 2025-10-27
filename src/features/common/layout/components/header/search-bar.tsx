/* eslint-disable no-console */
"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import { HelpTooltip } from "../help-tooltip";
import {
  SearchEmptyState,
  SearchRecentItems,
  SearchSuggestions,
} from "@/common/layout/components/search";
import { searchSuggestions } from "@/common/layout/config";
import { useKeyboardShortcuts, useRecentSearches } from "@/common/layout/hooks";
import { type SearchItem, type SearchSuggestion } from "@/common/layout/types";

export const SearchBar = React.memo(function SearchBar() {
  const { getModifierKey } = useKeyboardShortcuts();
  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useRecentSearches();

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredSuggestions = React.useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return searchSuggestions
      .filter((item) => item.title.toLowerCase().includes(lowerQuery))
      .slice(0, 8);
  }, [query]);

  const allItems = React.useMemo((): SearchItem[] => {
    const items: SearchItem[] = [];
    let index = 0;

    if (!query.trim()) {
      recentSearches.forEach((search) => {
        items.push({ type: "recent", data: search, index: index++ });
      });
    } else {
      filteredSuggestions.forEach((suggestion) => {
        items.push({ type: "suggestion", data: suggestion, index: index++ });
      });
    }

    return items;
  }, [query, recentSearches, filteredSuggestions]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < allItems.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && allItems[selectedIndex]) {
            const item = allItems[selectedIndex];
            if (item.type === "recent") {
              setQuery(item.data.query);
              addRecentSearch(item.data.query);
            } else {
              window.location.href = item.data.href;
              addRecentSearch(item.data.title);
            }
            setOpen(false);
            inputRef.current?.blur();
          } else if (query.trim()) {
            addRecentSearch(query);
            setOpen(false);
            inputRef.current?.blur();
          }
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [open, selectedIndex, allItems, query, addRecentSearch]
  );

  const handleSearch = React.useCallback(
    (searchQuery: string) => {
      if (searchQuery.trim()) {
        addRecentSearch(searchQuery);
        setOpen(false);
        inputRef.current?.blur();
        console.log("[v0] Searching for:", searchQuery);
      }
    },
    [addRecentSearch]
  );

  const handleSuggestionClick = React.useCallback(
    (suggestion: SearchSuggestion) => {
      addRecentSearch(suggestion.title);
      window.location.href = suggestion.href;
      setOpen(false);
    },
    [addRecentSearch]
  );

  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-sidebar-foreground/60" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search OnchainSuite..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            className="w-full bg-sidebar-foreground/10 border-sidebar-foreground/20 pl-9 text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus-visible:bg-sidebar-foreground/15 focus-visible:ring-sidebar-foreground/30"
          />
          <div className="absolute items-center hidden gap-1 -translate-y-1/2 right-3 top-1/2 md:flex">
            <HelpTooltip
              content="Search for pages and features. Use arrow keys to navigate results, Enter to select, and Escape to close."
              side="bottom"
              className="mr-1"
            />
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded bg-sidebar-foreground/10 px-1.5 font-mono text-[12px] font-medium text-sidebar-foreground/60">
              {getModifierKey()}J
            </kbd>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        sideOffset={8}
      >
        <ScrollArea className="max-h-[400px]">
          {!query.trim() && (
            <SearchRecentItems
              recentSearches={recentSearches}
              selectedIndex={selectedIndex}
              onSearchClick={handleSearch}
              onRemoveSearch={removeRecentSearch}
              onClearAll={clearRecentSearches}
            />
          )}

          {query.trim() && (
            <SearchSuggestions
              suggestions={filteredSuggestions}
              selectedIndex={selectedIndex}
              onSuggestionClick={handleSuggestionClick}
            />
          )}

          <SearchEmptyState
            query={query}
            hasRecentSearches={recentSearches.length > 0}
          />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
});
