"use client";

import { useMemo, useState } from "react";

import { BulkSelectHeader } from "./bulk-select-header";
import { PaginationControls } from "./pagination-controls";
import { SearchInput } from "./search-input";
import { TagRow } from "./tag-row";

const mockTags = [
  {
    id: 1,
    name: "another new tag",
    createdDate: "August 11, 2025",
    selected: false,
  },
  { id: 2, name: "someNew", createdDate: "August 9, 2025", selected: false },
  { id: 3, name: "Influencer", createdDate: "July 24, 2025", selected: false },
  { id: 4, name: "Customer", createdDate: "July 24, 2025", selected: false },
  { id: 5, name: "newTag", createdDate: "July 24, 2025", selected: false },
];

export function TagsList() {
  const [tags, setTags] = useState(mockTags);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Added sort order state
  const [pageSize, setPageSize] = useState("25");

  const selectedCount = tags.filter((tag) => tag.selected).length;
  const allSelected = selectedCount === tags.length && tags.length > 0;
  const someSelected = selectedCount > 0 && selectedCount < tags.length;

  const handleSelectAll = (checked: boolean) => {
    setTags(tags.map((tag) => ({ ...tag, selected: checked })));
  };

  const handleSelectTag = (id: number, checked: boolean) => {
    setTags(
      tags.map((tag) => (tag.id === id ? { ...tag, selected: checked } : tag))
    );
  };

  const handleDeleteSelected = () => {
    setTags(tags.filter((tag) => !tag.selected));
  };

  const sortedAndFilteredTags = useMemo(() => {
    const filtered = tags.filter((tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date-created":
          comparison =
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime();
          break;
        case "usage":
          // Mock usage sorting - in real app this would be based on actual usage data
          comparison = a.name.length - b.name.length;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [tags, searchQuery, sortBy, sortOrder]); // Added sortOrder to dependencies

  return (
    <div className="space-y-6">
      {/* Search */}
      <SearchInput
        placeholder="Search tags"
        value={searchQuery}
        onChange={setSearchQuery}
        className="max-w-md flex-1"
      />

      {/* Bulk Select Header */}
      <BulkSelectHeader
        allSelected={allSelected}
        someSelected={someSelected}
        selectedCount={selectedCount}
        sortBy={sortBy}
        sortOrder={sortOrder} // Added sort order prop
        onSelectAll={handleSelectAll}
        onSortChange={setSortBy}
        onSortOrderChange={setSortOrder} // Added sort order change handler
        onDelete={handleDeleteSelected}
      />

      {/* Tags List */}
      <div className="space-y-1">
        {sortedAndFilteredTags.map((tag) => (
          <TagRow
            key={tag.id}
            tag={tag}
            onSelect={(checked) => handleSelectTag(tag.id, checked)}
          />
        ))}
      </div>

      {/* Pagination */}
      <PaginationControls
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        currentCount={sortedAndFilteredTags.length}
        totalCount={sortedAndFilteredTags.length}
      />
    </div>
  );
}
