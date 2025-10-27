"use client";

import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { FieldMapping, R3tainField } from "@/r3tain/community/types";

interface FieldMappingRowProps {
  mapping: FieldMapping;
  availableFields: R3tainField[];
  onMappingChange: (id: string, updates: Partial<FieldMapping>) => void;
  index: number;
}

export function FieldMappingRow({
  mapping,
  availableFields,
  onMappingChange,
  index,
}: FieldMappingRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSelectionChange = (checked: boolean) => {
    onMappingChange(mapping.id, { isSelected: checked });
  };

  const handleFieldChange = (fieldId: string) => {
    const field = availableFields.find((f) => f.id === fieldId);
    onMappingChange(mapping.id, {
      matchedField: fieldId,
      dataType: field?.type ?? mapping.dataType,
      isSuggested: false,
    });
  };

  const getArrowColor = () => {
    if (!mapping.isSelected) return "text-muted-foreground/30";
    if (mapping.confidence === "high") return "text-green-500";
    if (mapping.confidence === "medium") return "text-amber-500";
    return "text-muted-foreground";
  };

  const getArrowStyle = () => {
    if (mapping.confidence === "high") return "solid";
    if (mapping.confidence === "medium") return "dashed";
    return "solid";
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`border-border border-b transition-all duration-200 ${
        isHovered
          ? "bg-muted/30"
          : mapping.isSelected
            ? "bg-background"
            : "bg-muted/10"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Import Checkbox */}
      <td className="p-4">
        <Checkbox
          checked={mapping.isSelected}
          onCheckedChange={handleSelectionChange}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </td>

      {/* File Column Name */}
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={`font-mono text-sm transition-colors duration-200 ${
              mapping.isSelected
                ? "bg-muted text-foreground"
                : "bg-muted/50 text-muted-foreground"
            }`}
          >
            {mapping.fileColumnName}
          </Badge>
        </div>
      </td>

      {/* Arrow */}
      <td className="p-4 text-center">
        <div className="flex items-center justify-center">
          <ArrowRight
            className={`h-5 w-5 transition-all duration-200 ${getArrowColor()} ${
              getArrowStyle() === "dashed" ? "opacity-60" : ""
            }`}
            style={{
              strokeDasharray: getArrowStyle() === "dashed" ? "4 4" : "none",
            }}
          />
        </div>
      </td>

      {/* R3tain Field Selector */}
      <td className="p-4">
        <div className="space-y-2">
          <Select
            value={mapping.matchedField ?? "none"}
            onValueChange={handleFieldChange}
            disabled={!mapping.isSelected}
          >
            <SelectTrigger
              className={`w-full transition-all duration-200 ${
                mapping.isSelected
                  ? "bg-background border-border hover:border-primary/50"
                  : "bg-muted/50 border-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <SelectValue placeholder="Select field..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Don&apos;t import</SelectItem>
              {availableFields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  <div className="flex w-full items-center justify-between">
                    <span>{field.name}</span>
                    {field.required && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {mapping.isSuggested && mapping.isSelected && (
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Info className="h-3 w-3" />
              <span>Suggested based on your data</span>
            </div>
          )}
        </div>
      </td>

      {/* Preview Data */}
      <td className="p-4">
        <div className="max-w-xs space-y-1">
          {mapping.previewData.slice(0, 2).map((data, idx) => (
            <div
              key={idx}
              className={`truncate font-mono text-sm transition-colors duration-200 ${
                mapping.isSelected ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {data}
            </div>
          ))}
          {mapping.previewData.length > 2 && (
            <div className="text-muted-foreground text-xs">
              +{mapping.previewData.length - 2} more
            </div>
          )}
        </div>
      </td>

      {/* Data Type */}
      <td className="p-4">
        <Badge
          variant="outline"
          className={`transition-colors duration-200 ${
            mapping.isSelected
              ? "border-primary/20 text-foreground"
              : "border-muted text-muted-foreground"
          }`}
        >
          {mapping.dataType}
        </Badge>
      </td>
    </motion.tr>
  );
}
