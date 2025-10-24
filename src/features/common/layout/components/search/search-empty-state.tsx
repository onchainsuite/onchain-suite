"use client";

interface SearchEmptyStateProps {
  query: string;
  hasRecentSearches: boolean;
}

export function SearchEmptyState({
  query,
  hasRecentSearches,
}: SearchEmptyStateProps) {
  if (query.trim()) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        No results found for &quot;{query}&quot;
      </div>
    );
  }

  if (!hasRecentSearches) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Start typing to search
      </div>
    );
  }

  return null;
}
