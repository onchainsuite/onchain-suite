"use client";

import { useCallback, useEffect, useState } from "react";

import { type FieldMapping, R3TAIN_FIELDS } from "@/r3tain/community/types";

export function useFieldMappingValidation(mappings: FieldMapping[]) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateMappings = useCallback(() => {
    const errors: string[] = [];
    const selectedMappings = mappings.filter((m) => m.isSelected);

    // Check if at least one email field is mapped
    const hasEmailMapping = selectedMappings.some(
      (m) => m.matchedField === "email" && m.isSelected
    );

    if (!hasEmailMapping) {
      errors.push(
        "At least one Email Address field is required for importing subscribers."
      );
    }

    // Check for duplicate field mappings
    const fieldCounts = selectedMappings.reduce(
      (acc, mapping) => {
        if (mapping.matchedField) {
          acc[mapping.matchedField] = (acc[mapping.matchedField] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(fieldCounts).forEach(([fieldId, count]) => {
      if (count > 1) {
        const field = R3TAIN_FIELDS.find((f) => f.id === fieldId);
        errors.push(
          `Multiple columns are mapped to "${field?.name}". Each field can only be mapped once.`
        );
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  }, [mappings]);

  useEffect(() => {
    validateMappings();
  }, [mappings, validateMappings]);

  return {
    validationErrors,
    isValid: validationErrors.length === 0,
    validateMappings,
  };
}
