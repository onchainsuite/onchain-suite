"use client";

import { createContext, useCallback, useContext, useState } from "react";

import type {
  Community,
  FieldMapping,
  OrganizeSettings,
  SubscriptionSettings,
  TagSettings,
} from "@/r3tain/community/types";
import type { ValidationResult } from "@/r3tain/community/utils";

export interface ImportState {
  // Step 1: Method Selection
  selectedMethod: string | null;

  // Step 2: Upload
  uploadedFile: File | null;
  pastedData: string;
  validation: ValidationResult | null;

  // Step 3: Match
  fieldMappings: FieldMapping[];

  // Step 4: Organize
  organizeSettings: OrganizeSettings | null;
  selectedCommunity: Community | null;

  // Step 5: Tag
  tagSettings: TagSettings;

  // Step 6: Subscribe
  subscriptionSettings: SubscriptionSettings | null;
}

interface ImportContextType {
  state: ImportState;
  updateMethod: (method: string) => void;
  updateUpload: (
    file: File | null,
    data: string,
    validation: ValidationResult | null
  ) => void;
  updateFieldMappings: (mappings: FieldMapping[]) => void;
  updateOrganizeSettings: (
    settings: OrganizeSettings,
    community: Community
  ) => void;
  updateTagSettings: (settings: TagSettings) => void;
  updateSubscriptionSettings: (settings: SubscriptionSettings) => void;
  resetImport: () => void;
}

const initialState: ImportState = {
  selectedMethod: null,
  uploadedFile: null,
  pastedData: "",
  validation: null,
  fieldMappings: [],
  organizeSettings: null,
  selectedCommunity: null,
  tagSettings: { selectedTags: [] },
  subscriptionSettings: null,
};

const ImportContext = createContext<ImportContextType | undefined>(undefined);

export function ImportProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ImportState>(initialState);

  const updateMethod = useCallback((method: string) => {
    setState((prev) => ({ ...prev, selectedMethod: method }));
  }, []);

  const updateUpload = useCallback(
    (file: File | null, data: string, validation: ValidationResult | null) => {
      setState((prev) => ({
        ...prev,
        uploadedFile: file,
        pastedData: data,
        validation,
      }));
    },
    []
  );

  const updateFieldMappings = useCallback((mappings: FieldMapping[]) => {
    setState((prev) => ({ ...prev, fieldMappings: mappings }));
  }, []);

  const updateOrganizeSettings = useCallback(
    (settings: OrganizeSettings, community: Community) => {
      setState((prev) => ({
        ...prev,
        organizeSettings: settings,
        selectedCommunity: community,
      }));
    },
    []
  );

  const updateTagSettings = useCallback((settings: TagSettings) => {
    setState((prev) => ({ ...prev, tagSettings: settings }));
  }, []);

  const updateSubscriptionSettings = useCallback(
    (settings: SubscriptionSettings) => {
      setState((prev) => ({ ...prev, subscriptionSettings: settings }));
    },
    []
  );

  const resetImport = useCallback(() => {
    setState(initialState);
  }, []);

  const contextValue: ImportContextType = {
    state,
    updateMethod,
    updateUpload,
    updateFieldMappings,
    updateOrganizeSettings,
    updateTagSettings,
    updateSubscriptionSettings,
    resetImport,
  };

  return (
    <ImportContext.Provider value={contextValue}>
      {children}
    </ImportContext.Provider>
  );
}

export function useImport() {
  const context = useContext(ImportContext);
  if (context === undefined) {
    throw new Error("useImport must be used within an ImportProvider");
  }
  return context;
}
