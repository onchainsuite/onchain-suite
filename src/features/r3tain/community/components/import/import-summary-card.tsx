"use client";

import { motion } from "framer-motion";
import { CheckCircle, RefreshCw, Tag, Upload, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { ImportSummary } from "@/r3tain/community/types";

interface ImportSummaryCardProps {
  summary: ImportSummary;
}

export function ImportSummaryCard({ summary }: ImportSummaryCardProps) {
  const summaryItems = [
    {
      icon: Upload,
      label: "Imported from",
      value: summary.importMethod,
      color: "text-blue-600",
    },
    {
      icon: CheckCircle,
      label: "Email marketing status",
      value: summary.emailMarketingStatus,
      color: "text-green-600",
    },
    {
      icon: RefreshCw,
      label: "Update existing subscribers",
      value: summary.updateExistingSubscribers ? "Yes" : "No",
      color: "text-purple-600",
    },
    {
      icon: Tag,
      label: "Tagged",
      value:
        summary.selectedTags.length > 0
          ? summary.selectedTags.join(", ")
          : "No tags selected",
      color: "text-orange-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-border hover:border-primary/20 transition-colors duration-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Users className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Import Summary</CardTitle>
              <p className="text-muted-foreground text-sm">
                {summary.subscriberCount} subscriber
                {summary.subscriberCount !== 1 ? "s" : ""} will be updated or
                added to your &quot;{summary.communityName}&quot; community.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {summaryItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="bg-muted/30 hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 transition-colors duration-200"
            >
              <div className={`mt-0.5 shrink-0 ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-foreground text-sm font-medium">
                    {item.label}:
                  </span>
                </div>
                <div className="text-muted-foreground text-sm">
                  {item.label === "Tagged" &&
                  summary.selectedTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {summary.selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span>{item.value}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
