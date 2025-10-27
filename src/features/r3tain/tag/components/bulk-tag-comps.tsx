import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { FileUploadZone } from "./file-upload-zone";

export function BulkTagModalHeader() {
  return (
    <DialogHeader>
      <DialogTitle>Bulk tag subscribers</DialogTitle>
    </DialogHeader>
  );
}

export function BulkTagDescription() {
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-sm">
        You can create and apply a new tag, or apply an existing tag to
        subscribers within your audience in order to better target your
        marketing.
      </p>
      <p className="text-muted-foreground text-sm">
        You can also bulk select and{" "}
        <button className="text-primary hover:underline">
          tag from the contact table
        </button>
        .
      </p>
    </div>
  );
}

export function AudienceDisplay() {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Audience:</Label>
      <span className="text-sm">R3tain</span>
    </div>
  );
}

interface SubmitMethodSelectorProps {
  submitMethod: string;
  onSubmitMethodChange: (method: string) => void;
}

export function SubmitMethodSelector({
  submitMethod,
  onSubmitMethodChange,
}: SubmitMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        Choose how to submit your subscribers&apos; emails
      </Label>
      <RadioGroup value={submitMethod} onValueChange={onSubmitMethodChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="upload" id="upload" />
          <Label htmlFor="upload" className="text-sm">
            Upload email addresses
          </Label>
        </div>
        <div className="text-muted-foreground pl-6 text-sm">
          Acceptable file types:{" "}
          <button className="text-primary hover:underline">
            CSV or tab-delimited text files
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paste" id="paste" />
          <Label htmlFor="paste" className="text-sm">
            Paste email addresses
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

interface FileUploadSectionProps {
  onFileSelect: (file: File) => Promise<void>;
  uploadedFile: File | null;
  onRemoveFile: () => void;
  isProcessing: boolean;
  validEmailCount: number;
}

export function FileUploadSection({
  onFileSelect,
  uploadedFile,
  onRemoveFile,
  isProcessing,
  validEmailCount,
}: FileUploadSectionProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        Upload your subscribers&apos; email addresses
      </Label>
      <FileUploadZone
        onFileSelect={onFileSelect}
        uploadedFile={uploadedFile}
        onRemoveFile={onRemoveFile}
        isProcessing={isProcessing}
        validEmailCount={validEmailCount}
      />
    </div>
  );
}

interface EmailPasteSectionProps {
  pastedEmails: string;
  onPastedEmailsChange: (value: string) => void;
}

export function EmailPasteSection({
  pastedEmails,
  onPastedEmailsChange,
}: EmailPasteSectionProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Paste email addresses</Label>
      <Textarea
        placeholder="Enter email addresses (one per line or comma-separated)"
        value={pastedEmails}
        onChange={(e) => onPastedEmailsChange(e.target.value)}
        className="min-h-32 resize-y"
      />
    </div>
  );
}

interface ActionSelectorProps {
  action: string;
  onActionChange: (action: string) => void;
}

export function ActionSelector({
  action,
  onActionChange,
}: ActionSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Select action</Label>
      <Select value={action} onValueChange={onActionChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tag-these">
            <div className="flex items-center space-x-2">
              <Check className="text-primary h-4 w-4" />
              <span>Tag these emails</span>
            </div>
          </SelectItem>
          <SelectItem value="tag-except">
            Tag everyone except these emails
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

interface BulkTagModalActionsProps {
  onCancel: () => void;
  onApply: () => void;
  isDisabled: boolean;
  isProcessing: boolean;
}

export function BulkTagModalActions({
  onCancel,
  onApply,
  isDisabled,
  isProcessing,
}: BulkTagModalActionsProps) {
  return (
    <div className="flex justify-end space-x-2 border-t pt-4">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        onClick={onApply}
        className="bg-primary hover:bg-primary/90"
        disabled={isDisabled || isProcessing}
      >
        Apply tag
      </Button>
    </div>
  );
}
