"use client";

import { Clock, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
}

interface SearchRecentItemsProps {
  recentSearches: RecentSearch[];
  selectedIndex: number;
  onSearchClick: (query: string) => void;
  onRemoveSearch: (id: string) => void;
  onClearAll: () => void;
}

export function SearchRecentItems({
  recentSearches,
  selectedIndex,
  onSearchClick,
  onRemoveSearch,
  onClearAll,
}: SearchRecentItemsProps) {
  if (recentSearches.length === 0) return null;

  return (
    <div className="p-2">
      <div className="flex items-center justify-between px-2 py-1.5">
        <span className="text-xs font-semibold text-muted-foreground">
          Recent Searches
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      </div>
      <div className="space-y-1">
        {recentSearches.map((search, index) => (
          <button
            key={search.id}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-accent transition-colors group",
              selectedIndex === index && "bg-accent"
            )}
            onClick={() => onSearchClick(search.query)}
          >
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-left">{search.query}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSearch(search.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </button>
        ))}
      </div>
    </div>
  );
}
