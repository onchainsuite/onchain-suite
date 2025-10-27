"use client";

import { Check, Upload, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  uploadedFile: File | null;
  onRemoveFile: () => void;
  isProcessing: boolean;
  validEmailCount?: number;
}

export function FileUploadZone({
  onFileSelect,
  uploadedFile,
  onRemoveFile,
  isProcessing,
  validEmailCount,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const [file] = e.dataTransfer.files;
    if (file) onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  if (uploadedFile) {
    return (
      <div className="bg-muted/20 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{uploadedFile.name}</span>
            <span className="text-muted-foreground text-xs">
              ({(uploadedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onRemoveFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {validEmailCount !== undefined && validEmailCount > 0 && (
          <p className="mt-2 text-sm text-green-600">
            {validEmailCount} valid email(s) found
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      }`}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".csv,.txt";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) onFileSelect(file);
        };
        input.click();
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Upload className="text-muted-foreground mx-auto mb-4 h-8 w-8" />
      <p className="mb-2 text-sm font-medium">Choose a file to upload</p>
      <p className="text-muted-foreground mb-4 text-xs">or drag and drop</p>
      <Button variant="outline" size="sm" disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Add file"}
      </Button>
    </div>
  );
}
