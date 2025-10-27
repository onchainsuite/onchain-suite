"use client";

import { FieldMappingRow } from "./field-mapping-row";
import type { FieldMapping, R3tainField } from "@/r3tain/community/types";

interface MappingTableBodyProps {
  mappings: FieldMapping[];
  availableFields: R3tainField[];
  onMappingChange: (id: string, updates: Partial<FieldMapping>) => void;
}

export function MappingTableBody({
  mappings,
  availableFields,
  onMappingChange,
}: MappingTableBodyProps) {
  if (mappings.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={6} className="text-muted-foreground p-8 text-center">
            All columns are properly matched!
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {mappings.map((mapping, index) => (
        <FieldMappingRow
          key={mapping.id}
          mapping={mapping}
          availableFields={availableFields}
          onMappingChange={onMappingChange}
          index={index}
        />
      ))}
    </tbody>
  );
}
