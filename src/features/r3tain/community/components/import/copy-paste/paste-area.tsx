"use client";

import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import {
  type ValidationResult,
  ValidationService,
} from "@/r3tain/community/services";

interface PasteAreaProps {
  onDataChange: (data: string, validation: ValidationResult) => void;
}

const EXAMPLE_DATA = `Email Address, First Name, Last Name, Address
Joelobafemi@gmail.com, Joel, Obafemi, Abuja`;

export function PasteArea({ onDataChange }: PasteAreaProps) {
  const [inputData, setInputData] = useState("");

  const handleDataChange = (value: string) => {
    setInputData(value);

    if (value.trim()) {
      const validation = ValidationService.validateCSVData(value);
      onDataChange(value, validation);
    } else {
      onDataChange(value, { isValid: false, errors: [], warnings: [] });
    }
  };

  const copyExample = () => {
    navigator.clipboard.writeText(EXAMPLE_DATA);
    setInputData(EXAMPLE_DATA);
    handleDataChange(EXAMPLE_DATA);
  };

  return (
    <div className="space-y-6">
      <ExampleSection onCopy={copyExample} />
      <InputSection value={inputData} onChange={handleDataChange} />
    </div>
  );
}

function ExampleSection({ onCopy }: { onCopy: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-muted">
        <CardContent className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <h4 className="text-foreground font-medium">Example:</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={onCopy}
              className="h-8 bg-transparent px-3"
            >
              <Copy className="mr-1 h-3 w-3" />
              Copy
            </Button>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
            <div className="text-muted-foreground mb-1">
              Email Address, First Name, Last Name, Address
            </div>
            <div className="text-foreground">
              Joelobafemi@gmail.com, Joel, Obafemi, Abuja
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InputSection({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-3"
    >
      <label
        htmlFor="paste-area"
        className="text-foreground block text-sm font-medium"
      >
        Paste your subscriber data:
      </label>
      <Textarea
        id="paste-area"
        placeholder="Paste your subscriber data here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] resize-none font-mono text-sm"
      />
      <p className="text-muted-foreground text-xs">
        Make sure each row contains the same number of columns as your header
        row.
      </p>
    </motion.div>
  );
}
