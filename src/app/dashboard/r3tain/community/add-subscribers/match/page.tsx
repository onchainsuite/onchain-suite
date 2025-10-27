"use client";

import { useState } from "react";

import {
  FieldMappingTable,
  ValidationErrors,
} from "@/r3tain/community/components/import/field-mapping";
import { ImportLayout } from "@/r3tain/community/components/import/import-layout";
import {
  ContinueButton,
  PageHeader,
} from "@/r3tain/community/components/shared";
import { useImport } from "@/r3tain/community/context";
import { mockMappings } from "@/r3tain/community/data";
import {
  useFieldMappingValidation,
  useImportNavigation,
} from "@/r3tain/community/hooks";
import { type FieldMapping, R3TAIN_FIELDS } from "@/r3tain/community/types";

export default function MatchPage() {
  const { state, updateFieldMappings } = useImport();
  const { navigateToStep } = useImportNavigation();
  const [mappings, setMappings] = useState<FieldMapping[]>(
    state.fieldMappings.length > 0 ? state.fieldMappings : mockMappings
  );

  const { validationErrors, isValid } = useFieldMappingValidation(mappings);

  const handleMappingChange = (id: string, updates: Partial<FieldMapping>) => {
    const newMappings = mappings.map((mapping) =>
      mapping.id === id ? { ...mapping, ...updates } : mapping
    );
    setMappings(newMappings);
    updateFieldMappings(newMappings);
  };

  const handleContinue = () => {
    if (isValid) {
      navigateToStep("organize");
    }
  };

  const selectedCount = mappings.filter((m) => m.isSelected).length;
  const canContinue = selectedCount > 0 && isValid;

  return (
    <ImportLayout currentStep={2}>
      <PageHeader
        title="Let's make sure your data transfers correctly"
        subtitle="Each column from your file needs to be matched to a field in R3tain. Select the columns you want to import and update any that are not mapped."
      />

      <ValidationErrors errors={validationErrors} />

      <FieldMappingTable
        mappings={mappings}
        availableFields={R3TAIN_FIELDS}
        onMappingChange={handleMappingChange}
      />

      <ContinueButton onClick={handleContinue} disabled={!canContinue} />
    </ImportLayout>
  );
}
