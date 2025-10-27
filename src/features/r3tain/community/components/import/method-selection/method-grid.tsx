"use client";

import { Clipboard, Download, Upload } from "lucide-react";

import { ImportMethodCard } from "../import-method-card";

interface MethodGridProps {
  selectedMethod: string | null;
  onMethodSelect: (methodId: string) => void;
  onHelpClick: (helpText: string) => void;
}

const importMethods = [
  {
    id: "import-service",
    title: "Import from Other Services",
    description:
      "Helps ensure data between R3tain and your 3rd party app automatically syncs.",
    icon: Download,
    helpText: "How to import from other services",
  },
  {
    id: "upload-file",
    title: "Upload a File",
    description:
      "Use CSV or tab-delimited TXT files. Be sure files are formatted properly and data is clean.",
    icon: Upload,
    helpText: "How to Format your file",
  },
  {
    id: "copy-paste",
    title: "Copy and Paste",
    description:
      "Directly paste in new subscribers from a spreadsheet or similar list.",
    icon: Clipboard,
    helpText: "How to Copy and Paste",
  },
];

export function MethodGrid({
  selectedMethod,
  onMethodSelect,
  onHelpClick,
}: MethodGridProps) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {importMethods.map((method, index) => (
        <ImportMethodCard
          key={method.id}
          title={method.title}
          description={method.description}
          icon={method.icon}
          helpText={method.helpText}
          onHelpClick={() => onHelpClick(method.helpText)}
          onSelect={() => onMethodSelect(method.id)}
          isSelected={selectedMethod === method.id}
          delay={0.5 + index * 0.1}
        />
      ))}
    </section>
  );
}
