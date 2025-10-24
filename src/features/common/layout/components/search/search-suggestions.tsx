"use client";

import { ArrowRight, Search } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchSuggestion {
  title: string;
  href: string;
  category: string;
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  selectedIndex: number;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
}

export function SearchSuggestions({
  suggestions,
  selectedIndex,
  onSuggestionClick,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="p-2">
      <div className="px-2 py-1.5">
        <span className="text-xs font-semibold text-muted-foreground">
          Suggestions
        </span>
      </div>
      <div className="space-y-1">
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion.href}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-accent transition-colors",
              selectedIndex === index && "bg-accent"
            )}
            onClick={() => onSuggestionClick(suggestion)}
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 text-left">
              <div className="font-medium">{suggestion.title}</div>
              <div className="text-xs text-muted-foreground">
                {suggestion.category}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
