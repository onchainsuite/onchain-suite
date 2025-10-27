"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Cloud } from "lucide-react";
import { useCallback, useState } from "react";

import {
  type ValidationResult,
  ValidationService,
} from "@/r3tain/community/services";

interface UploadZoneProps {
  onFileSelect: (file: File, validation: ValidationResult) => void;
  acceptedTypes?: string;
  maxSize?: string;
}

export function UploadZone({
  onFileSelect,
  acceptedTypes = ".csv,.txt,.xlsx",
  maxSize = "Max file size: 100 MB (CSV, TXT), 50 MB (XLSX)",
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelection = useCallback(
    (file: File) => {
      const validation = ValidationService.validateFileType(file);
      setSelectedFile(file);
      onFileSelect(file, validation);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelection(files[0]);
      }
    },
    [handleFileSelection]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 lg:p-12 ${
        isDragOver
          ? "border-primary bg-primary/5 scale-105"
          : selectedFile
            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={acceptedTypes}
        onChange={handleFileInputChange}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        id="file-upload"
      />

      <AnimatePresence mode="wait">
        {selectedFile ? (
          <SelectedFileDisplay
            key="selected"
            file={selectedFile}
            onRemove={() => setSelectedFile(null)}
          />
        ) : (
          <UploadPrompt
            key="upload"
            isDragOver={isDragOver}
            maxSize={maxSize}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SelectedFileDisplay({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-4"
    >
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <div>
        <h3 className="text-foreground mb-2 text-lg font-semibold">
          File Selected
        </h3>
        <p className="text-muted-foreground text-sm">{file.name}</p>
        <p className="text-muted-foreground mt-1 text-xs">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
      <button
        onClick={onRemove}
        className="border-border hover:bg-muted mt-4 rounded-md border px-4 py-2 text-sm transition-colors"
      >
        Remove File
      </button>
    </motion.div>
  );
}

function UploadPrompt({
  isDragOver,
  maxSize,
}: {
  isDragOver: boolean;
  maxSize: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-4"
    >
      <motion.div
        animate={
          isDragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.2 }}
      >
        <Cloud className="text-muted-foreground mx-auto h-16 w-16" />
      </motion.div>
      <div>
        <h3 className="text-foreground mb-2 text-lg font-semibold">
          Drag and Drop or{" "}
          <label
            htmlFor="file-upload"
            className="text-primary cursor-pointer hover:underline"
          >
            Select a file
          </label>
        </h3>
        <p className="text-muted-foreground text-sm">{maxSize}</p>
      </div>
    </motion.div>
  );
}
