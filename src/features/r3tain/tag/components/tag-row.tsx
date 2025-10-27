"use client";

import { Badge, Checkbox, SplitButton } from "@/components/ui";

import { TagActionsDropdown } from "./tag-actions-dropdown";

interface Tag {
  id: number;
  name: string;
  createdDate: string;
  selected: boolean;
}

interface TagRowProps {
  tag: Tag;
  onSelect: (checked: boolean) => void;
}

export function TagRow({ tag, onSelect }: TagRowProps) {
  const handleView = () => {
    console.log("Viewing tag:", tag.name);
  };

  const handleRename = () => {
    console.log("Renaming tag:", tag.name);
  };

  const handleDelete = () => {
    console.log("Deleting tag:", tag.name);
  };

  const handleExportCSV = () => {
    console.log("Exporting CSV for tag:", tag.name);
  };

  return (
    <div className="hover:bg-muted/50 group flex flex-col gap-4 rounded-lg px-2 py-4 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center space-x-4">
        <Checkbox
          checked={tag.selected}
          onCheckedChange={onSelect}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />

        <div className="flex flex-1 items-center space-x-3">
          <Badge
            variant="secondary"
            className="bg-muted hover:bg-muted/80 font-medium transition-colors"
          >
            {tag.name}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-4 sm:justify-end">
        <div className="text-muted-foreground text-sm">
          <div className="font-medium">Created date</div>
          <div>{tag.createdDate}</div>
        </div>

        <SplitButton
          onMainClick={handleView}
          dropdownContent={
            <TagActionsDropdown
              onRename={handleRename}
              onDelete={handleDelete}
              onExportCSV={handleExportCSV}
              onSendRegularEmail={() => console.log("Send regular email")}
              onSendABTest={() => console.log("Send A/B test")}
              onSendPlainText={() => console.log("Send plain text")}
              onSendRSS={() => console.log("Send RSS")}
            />
          }
        >
          View
        </SplitButton>
      </div>
    </div>
  );
}
