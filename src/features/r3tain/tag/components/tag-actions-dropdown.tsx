"use client";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TagActionsDropdownProps {
  onRename?: () => void;
  onDelete?: () => void;
  onExportCSV?: () => void;
  onSendRegularEmail?: () => void;
  onSendABTest?: () => void;
  onSendPlainText?: () => void;
  onSendRSS?: () => void;
}

export function TagActionsDropdown({
  onRename,
  onDelete,
  onExportCSV,
  onSendRegularEmail,
  onSendABTest,
  onSendPlainText,
  onSendRSS,
}: TagActionsDropdownProps) {
  return (
    <>
      <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
      <DropdownMenuItem className="text-destructive" onClick={onDelete}>
        Delete
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onExportCSV}>Export as CSV</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onSendRegularEmail}>
        Send regular email
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onSendABTest}>
        Send A/B testing campaign
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onSendPlainText}>
        Send plain-text email
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onSendRSS}>Send RSS email</DropdownMenuItem>
    </>
  );
}
