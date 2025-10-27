"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Upload,
  Users,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { ImportResult } from "@/r3tain/community/types";

interface ImportResultSummaryProps {
  result: ImportResult;
}

export function ImportResultSummary({ result }: ImportResultSummaryProps) {
  const getStatusIcon = () => {
    switch (result.status) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "partial":
        return <AlertCircle className="h-6 w-6 text-amber-600" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <CheckCircle className="h-6 w-6 text-green-600" />;
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case "success":
        return "border-green-200 bg-green-50 dark:bg-green-950/20";
      case "partial":
        return "border-amber-200 bg-amber-50 dark:bg-amber-950/20";
      case "error":
        return "border-red-200 bg-red-50 dark:bg-red-950/20";
      default:
        return "border-green-200 bg-green-50 dark:bg-green-950/20";
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card
        className={`border-2 transition-colors duration-200 ${getStatusColor()}`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 shrink-0">{getStatusIcon()}</div>
            <div className="flex-1">
              <CardTitle className="mb-2 text-xl">
                {result.status === "success" && "Import Completed Successfully"}
                {result.status === "partial" &&
                  "Your import encountered an error"}
                {result.status === "error" && "Import Failed"}
              </CardTitle>
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Upload className="h-4 w-4" />
                  <span>
                    You attempted to import {result.totalAttempted} contacts
                    through {result.method}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>on {formatDate(result.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Success/Error Message */}
          {result.status === "partial" && (
            <div className="rounded-lg border border-amber-200 bg-amber-100 p-3 dark:border-amber-800 dark:bg-amber-950/30">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                An error was encountered; we suggest that you resolve it before
                attempting to import again.
              </p>
            </div>
          )}

          {result.status === "error" && (
            <div className="rounded-lg border border-red-200 bg-red-100 p-3 dark:border-red-800 dark:bg-red-950/30">
              <p className="text-sm text-red-800 dark:text-red-200">
                The import failed completely. Please check your data and try
                again.
              </p>
            </div>
          )}

          {result.status === "success" && (
            <div className="rounded-lg border border-green-200 bg-green-100 p-3 dark:border-green-800 dark:bg-green-950/30">
              <p className="text-sm text-green-800 dark:text-green-200">
                All contacts were successfully imported to your community.
              </p>
            </div>
          )}

          {/* Results Summary */}
          <div className="space-y-3">
            {result.successfullyAdded > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20"
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  {result.successfullyAdded} new contact
                  {result.successfullyAdded !== 1 ? "s" : ""} were added
                </span>
              </motion.div>
            )}

            {result.updated > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20"
              >
                <Users className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {result.updated} existing contact
                  {result.updated !== 1 ? "s" : ""} were updated
                </span>
              </motion.div>
            )}

            {result.errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20"
              >
                <XCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  {result.errors.length} error
                  {result.errors.length !== 1 ? "s" : ""} encountered
                </span>
              </motion.div>
            )}
          </div>

          {/* Community and Tags Info */}
          <div className="border-border border-t pt-4">
            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Community: {result.communityName}</span>
              </div>
              {result.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span>Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {result.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
