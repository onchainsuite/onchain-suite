"use client";

import { useEffect, useMemo, useState } from "react";

import {
  EmptyState,
  FlowListItem,
  FlowsHeader,
  FlowsPagination,
} from "./components";
import { mockFlows } from "./data";
import { type FlowFilters } from "./types";

const ITEMS_PER_PAGE = 10;

export function AllFlowsPage() {
  const [filters, setFilters] = useState<FlowFilters>({
    status: [],
    dateRange: "all",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter flows based on current filters
  const filteredFlows = useMemo(() => {
    return mockFlows.filter((flow) => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(flow.status)) {
        return false;
      }

      // Search filter
      if (
        filters.search &&
        !flow.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Date range filter would go here
      // For now, we'll just return true for all date ranges

      return true;
    });
  }, [filters]);

  // Pagination
  const totalPages = Math.ceil(filteredFlows.length / ITEMS_PER_PAGE);
  const paginatedFlows = filteredFlows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const hasFilters =
    filters.status.length > 0 || filters.search || filters.dateRange !== "all";

  const clearFilters = () => {
    setFilters({
      status: [],
      dateRange: "all",
      search: "",
    });
  };

  return (
    <div className="space-y-8">
      <FlowsHeader
        filters={filters}
        onFiltersChange={setFilters}
        totalFlows={filteredFlows.length}
      />

      {filteredFlows.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onClearFilters={clearFilters} />
      ) : (
        <div className="mx-auto h-full max-w-6xl p-4 sm:overflow-y-auto">
          <div className="h-full space-y-4">
            {paginatedFlows.map((flow, index) => (
              <FlowListItem key={flow.id} flow={flow} index={index} />
            ))}
          </div>

          {totalPages > 1 && (
            <FlowsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredFlows.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
    </div>
  );
}
