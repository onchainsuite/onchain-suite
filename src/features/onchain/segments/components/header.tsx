import { History } from "lucide-react";

import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

import { CreateSegmentDialog } from "./dialog";
import {
  type CreateSegmentFormData,
  type VersionedPageHeaderProps,
} from "@/onchain/segments/types";

interface PageHeaderProps {
  handleCreateSegment: (data: CreateSegmentFormData) => void;
  onHistoryClick: () => void;
  isCreateOpen: boolean;
  setIsCreateOpen: (isOpen: boolean) => void;
}

export function PageHeader({
  onHistoryClick,
  isCreateOpen,
  setIsCreateOpen,
  handleCreateSegment,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:items-center sm:flex-row">
      <div>
        <h1 className="text-3xl font-semibold text-balance">
          Segment Management
        </h1>
        <p className="mt-1 text-muted-foreground">
          Create and manage user segments for targeted analytics
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="gap-2 bg-transparent"
          onClick={onHistoryClick}
        >
          <History className="w-4 h-4" />
          Version History
        </Button>

        <CreateSegmentDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreateSegment}
        />
      </div>
    </div>
  );
}

export function VersionedPageHeader({
  selectedSegment,
  onSegmentChange,
  segments,
}: VersionedPageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:items-center sm:flex-row">
      <div>
        <h1 className="text-3xl font-semibold text-balance">
          Versioned Segments
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track segment changes over time
        </p>
      </div>
      <Select value={selectedSegment} onValueChange={onSegmentChange}>
        <SelectTrigger className="w-64">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {segments.map((segment) => (
            <SelectItem key={segment.value} value={segment.value}>
              {segment.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
