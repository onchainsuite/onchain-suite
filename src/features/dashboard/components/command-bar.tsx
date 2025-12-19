"use client";

import { ArrowUp, Mic, Search } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

const suggestions = [
  "What can you do?",
  "Create new deal",
  "Send follow-up email",
  "Show recent meetings",
  "Connect calendar",
  "Show my contacts",
  "Generate report",
  "Schedule a call",
];

export function CommandBar() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(0);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && filteredSuggestions[selectedIndex]) {
      e.preventDefault();
      setQuery(filteredSuggestions[selectedIndex]);
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="relative flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-ring">
        <Search className="h-5 w-5 shrink-0 text-muted-foreground mr-2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What can I do for you?"
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Voice input"
        >
          <Mic className="h-5 w-5" />
        </button>
        <button
          className="rounded-lg bg-primary p-1.5 text-primary-foreground transition-all hover:bg-primary/90"
          aria-label="Submit"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full z-10 mt-2 animate-in fade-in slide-in-from-top-2 rounded-xl border border-border bg-popover p-2 shadow-lg">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                filteredSuggestions.indexOf(suggestion) === selectedIndex
                  ? "bg-accent text-accent-foreground"
                  : "text-popover-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
