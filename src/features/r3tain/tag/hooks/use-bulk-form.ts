import { useState } from "react";

import { parseEmailsFromContent, validateFile } from "@/r3tain/tag/utils";

interface BulkTagFormState {
  submitMethod: string;
  action: string;
  uploadedFile: File | null;
  pastedEmails: string;
  validationErrors: string[];
  validEmails: string[];
  isProcessing: boolean;
}

const initialState: BulkTagFormState = {
  submitMethod: "upload",
  action: "tag-these",
  uploadedFile: null,
  pastedEmails: "",
  validationErrors: [],
  validEmails: [],
  isProcessing: false,
};

export const useBulkTagForm = () => {
  const [state, setState] = useState<BulkTagFormState>(initialState);

  const updateState = (updates: Partial<BulkTagFormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setState((prev) => ({
      ...prev,
      uploadedFile: null,
      pastedEmails: "",
      validEmails: [],
      validationErrors: [],
    }));
  };

  const handleFileUpload = async (file: File) => {
    updateState({ isProcessing: true, validationErrors: [], validEmails: [] });

    const validation = validateFile(file);
    if (!validation.valid) {
      updateState({
        validationErrors: [validation.error ?? "Invalid file"],
        isProcessing: false,
      });
      return;
    }

    try {
      const content = await file.text();
      const { emails, errors } = parseEmailsFromContent(content);
      updateState({
        validEmails: emails,
        validationErrors: errors,
        uploadedFile: file,
        isProcessing: false,
      });
    } catch (error) {
      console.error(error);
      updateState({
        validationErrors: ["Failed to read file content"],
        isProcessing: false,
      });
    }
  };

  const handlePastedEmailsChange = (value: string) => {
    if (value.trim()) {
      const { emails, errors } = parseEmailsFromContent(value);
      updateState({
        pastedEmails: value,
        validEmails: emails,
        validationErrors: errors,
      });
    } else {
      updateState({
        pastedEmails: value,
        validEmails: [],
        validationErrors: [],
      });
    }
  };

  const handleRemoveFile = () => {
    updateState({
      uploadedFile: null,
      validEmails: [],
      validationErrors: [],
    });
  };

  return {
    ...state,
    updateState,
    resetForm,
    handleFileUpload,
    handlePastedEmailsChange,
    handleRemoveFile,
    // Convenience setters for commonly updated fields
    setSubmitMethod: (method: string) => updateState({ submitMethod: method }),
    setAction: (action: string) => updateState({ action }),
    setValidationErrors: (errors: string[]) =>
      updateState({ validationErrors: errors }),
  };
};
