import { PaginationControls } from "./pagination-controls";
import { SegmentListItem } from "./segment-list-item";
import { SortControls } from "./sort-controls";
import type {
  SavedSegment,
  SortOption,
  SortOrder,
} from "@/r3tain/segment/types";

interface SavedSegmentsListProps {
  segments: SavedSegment[];
  selectedSegments: string[];
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSortChange: (sort: SortOption) => void;
  onSortOrderChange: (order: SortOrder) => void;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  hasSelection: boolean;
  onDelete: () => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export function SavedSegmentsList({
  segments,
  selectedSegments,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
  onToggleSelection,
  onSelectAll,
  isAllSelected,
  hasSelection,
  onDelete,
  pageSize,
  onPageSizeChange,
}: SavedSegmentsListProps) {
  const handleEdit = (id: string) => {
    console.log("Edit segment:", id);
  };

  const handleDeleteSingle = (id: string) => {
    console.log("Delete segment:", id);
  };

  const handleReplicate = (id: string) => {
    console.log("Replicate segment:", id);
  };

  const handleExport = (id: string) => {
    console.log("Export segment:", id);
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Saved by you</h2>

      <SortControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
        onSortOrderChange={onSortOrderChange}
        isAllSelected={isAllSelected}
        onSelectAll={onSelectAll}
        hasSelection={hasSelection}
        onDelete={onDelete}
      />

      <div className="space-y-2">
        {segments.map((segment) => (
          <SegmentListItem
            key={segment.id}
            segment={segment}
            isSelected={selectedSegments.includes(segment.id)}
            onToggleSelection={onToggleSelection}
            onEdit={handleEdit}
            onDelete={handleDeleteSingle}
            onReplicate={handleReplicate}
            onExport={handleExport}
          />
        ))}
      </div>

      <PaginationControls
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        currentPage={1}
        totalItems={segments.length}
      />
    </div>
  );
}
