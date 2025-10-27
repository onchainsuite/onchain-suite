"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { MappingSummary } from "./mapping-summary";
import { MappingTableBody } from "./mapping-table-body";
import { MappingTableHeader } from "./mapping-table-header";
import type { FieldMapping, R3tainField } from "@/r3tain/community/types";

interface FieldMappingTableProps {
  mappings: FieldMapping[];
  availableFields: R3tainField[];
  onMappingChange: (id: string, updates: Partial<FieldMapping>) => void;
}

export function FieldMappingTable({
  mappings,
  availableFields,
  onMappingChange,
}: FieldMappingTableProps) {
  const [showUnmatchedOnly, setShowUnmatchedOnly] = useState(false);

  const selectedCount = mappings.filter((m) => m.isSelected).length;
  const totalCount = mappings.length;

  const filteredMappings = showUnmatchedOnly
    ? mappings.filter((m) => !m.matchedField || !m.isSelected)
    : mappings;

  return (
    <div className="space-y-6">
      <MappingSummary
        selectedCount={selectedCount}
        totalCount={totalCount}
        showUnmatchedOnly={showUnmatchedOnly}
        onToggleFilter={() => setShowUnmatchedOnly(!showUnmatchedOnly)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="border-border bg-card overflow-hidden rounded-lg border"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <MappingTableHeader />
            <MappingTableBody
              mappings={filteredMappings}
              availableFields={availableFields}
              onMappingChange={onMappingChange}
            />
          </table>
        </div>
      </motion.div>
    </div>
  );
}
