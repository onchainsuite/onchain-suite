"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  Info,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { ImportError, ImportWarning } from "@/r3tain/community/types";

interface ErrorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ImportError[];
  warnings: ImportWarning[];
}

export function ErrorDetailsModal({
  isOpen,
  onClose,
  errors,
  warnings,
}: ErrorDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"errors" | "warnings">("errors");

  const getErrorIcon = (type: ImportError["type"]) => {
    switch (type) {
      case "validation":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "duplicate":
        return <Info className="h-4 w-4 text-blue-600" />;
      case "system":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "permission":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
    }
  };

  const getErrorColor = (type: ImportError["type"]) => {
    switch (type) {
      case "validation":
        return "border-amber-200 bg-amber-50 dark:bg-amber-950/20";
      case "duplicate":
        return "border-blue-200 bg-blue-50 dark:bg-blue-950/20";
      case "system":
        return "border-red-200 bg-red-50 dark:bg-red-950/20";
      case "permission":
        return "border-orange-200 bg-orange-50 dark:bg-orange-950/20";
      default:
        return "border-amber-200 bg-amber-50 dark:bg-amber-950/20";
    }
  };

  const copyErrorDetails = () => {
    const errorText = errors
      .map(
        (error) =>
          `${error.type.toUpperCase()}: ${error.message}${error.details ? ` - ${error.details}` : ""}`
      )
      .join("\n");
    navigator.clipboard.writeText(errorText);
  };

  const downloadErrorReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      errors,
      warnings,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `import-errors-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Import Error Details
          </DialogTitle>
          <DialogDescription>
            Review the errors and warnings from your import to understand what
            went wrong.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Tabs */}
          <div className="bg-muted mb-4 flex gap-1 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("errors")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "errors"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Errors ({errors.length})
            </button>
            <button
              onClick={() => setActiveTab("warnings")}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "warnings"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Warnings ({warnings.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === "errors" ? (
                <motion.div
                  key="errors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {errors.map((error, index) => (
                    <motion.div
                      key={error.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Alert className={`${getErrorColor(error.type)} border`}>
                        <div className="flex items-start gap-3">
                          {getErrorIcon(error.type)}
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {error.type}
                              </Badge>
                            </div>
                            <AlertDescription className="mb-1 text-sm font-medium">
                              {error.message}
                            </AlertDescription>
                            {error.details && (
                              <AlertDescription className="text-muted-foreground text-xs">
                                {error.details}
                              </AlertDescription>
                            )}
                            {error.affectedRows &&
                              error.affectedRows.length > 0 && (
                                <AlertDescription className="text-muted-foreground mt-1 text-xs">
                                  Affected rows: {error.affectedRows.join(", ")}
                                </AlertDescription>
                              )}
                          </div>
                        </div>
                      </Alert>
                    </motion.div>
                  ))}

                  {errors.length === 0 && (
                    <div className="text-muted-foreground py-8 text-center">
                      <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
                      <p>No errors found!</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="warnings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {warnings.map((warning, index) => (
                    <motion.div
                      key={warning.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <div className="mb-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {warning.type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {warning.count} affected
                          </Badge>
                        </div>
                        <AlertDescription className="text-sm">
                          {warning.message}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  ))}

                  {warnings.length === 0 && (
                    <div className="text-muted-foreground py-8 text-center">
                      <Info className="mx-auto mb-3 h-12 w-12 text-blue-500" />
                      <p>No warnings found!</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={copyErrorDetails}
            className="flex items-center gap-2 bg-transparent"
          >
            <Copy className="h-4 w-4" />
            Copy Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadErrorReport}
            className="flex items-center gap-2 bg-transparent"
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button onClick={onClose} className="ml-auto">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
