"use client";

import { motion } from "framer-motion";
import { Info, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface UpdateSettingsProps {
  updateExisting: boolean;
  onUpdateChange: (checked: boolean) => void;
  onHelpClick?: () => void;
}

export function UpdateSettings({
  updateExisting,
  onUpdateChange,
  onHelpClick,
}: UpdateSettingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <Card className="border-border hover:border-primary/20 transition-colors duration-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Checkbox Section */}
            <div className="flex items-start gap-4">
              <div className="flex items-center pt-1">
                <Checkbox
                  id="update-existing"
                  checked={updateExisting}
                  onCheckedChange={onUpdateChange}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="update-existing"
                    className="text-foreground flex cursor-pointer items-center gap-2 text-base font-medium"
                  >
                    <RefreshCw className="text-primary h-4 w-4" />
                    Update Existing Subscribers
                  </label>

                  {onHelpClick && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={onHelpClick}
                      className="text-primary hover:text-primary/80 h-auto p-0 text-sm"
                    >
                      How to update existing Subscribers
                    </Button>
                  )}
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  We&apos;ll automatically replace their information with the
                  data from your import. Otherwise, we won&apos;t import any
                  duplicates.
                </p>
              </div>
            </div>

            {/* Info Section */}
            {updateExisting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20"
              >
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="mb-1 font-medium">Update Mode Enabled</p>
                    <p>
                      Existing subscribers with matching email addresses will
                      have their information updated with the new data from your
                      import.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {!updateExisting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20"
              >
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="mb-1 font-medium">Skip Duplicates Mode</p>
                    <p>
                      Subscribers with email addresses that already exist in
                      your community will be skipped.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
