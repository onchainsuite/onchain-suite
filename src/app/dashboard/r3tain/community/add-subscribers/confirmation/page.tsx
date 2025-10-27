"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Eye, Home, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { ErrorDetailsModal } from "@/r3tain/community/components/import/error-details-modal";
import { ImportHeader } from "@/r3tain/community/components/import/import-header";
import { ImportResultSummary } from "@/r3tain/community/components/import/import-result-summary";
import { ProgressBreadcrumb } from "@/r3tain/community/components/import/progress-breadcrumb";
import { useImport } from "@/r3tain/community/context";
import { mockImportResult } from "@/r3tain/community/data";
import type { ImportResult } from "@/r3tain/community/types";

const breadcrumbSteps = [
  { label: "Choose Method", isActive: false, isCompleted: true },
  { label: "Upload", isActive: false, isCompleted: true },
  { label: "Match", isActive: false, isCompleted: true },
  { label: "Organize", isActive: false, isCompleted: true },
  { label: "Tag", isActive: false, isCompleted: true },
  { label: "Subscribe", isActive: false, isCompleted: true },
  { label: "Complete", isActive: false, isCompleted: true },
  { label: "Confirmation", isActive: true, isCompleted: false },
];

export default function ConfirmationPage() {
  const router = useRouter();
  const { resetImport } = useImport();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [importResult] = useState<ImportResult>(mockImportResult);

  const handleBack = () => {
    router.push(`${PRIVATE_ROUTES.R3TAIN.ADD_SUBSCRIBERS}/complete`);
  };

  const handleExit = () => {
    resetImport();
    router.push(PRIVATE_ROUTES.R3TAIN.COMMUNITY);
  };

  const handleViewErrors = () => {
    setIsErrorModalOpen(true);
  };

  const handleStartCampaign = () => {
    // Navigate to campaign creation
    console.log("Starting campaign...");
    router.push(PRIVATE_ROUTES.R3TAIN.CAMPAIGNS);
  };

  const handleGoToDashboard = () => {
    resetImport();
    router.push(PRIVATE_ROUTES.R3TAIN.COMMUNITY);
  };

  const handleViewCommunity = () => {
    resetImport();
    router.push(PRIVATE_ROUTES.R3TAIN.SUBSCRIBERS);
  };

  return (
    <div className="min-h-screen bg-background">
      <ImportHeader onBack={handleBack} onExit={handleExit} />

      <div className="max-w-4xl px-4 py-6 mx-auto lg:px-8 lg:py-8">
        {/* Progress Breadcrumb */}
        <div className="mb-8">
          <ProgressBreadcrumb steps={breadcrumbSteps} />
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Import Result Summary */}
          <ImportResultSummary result={importResult} />

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            {/* Error/Warning Actions */}
            {(importResult.errors.length > 0 ||
              importResult.warnings.length > 0) && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleViewErrors}
                className="flex items-center gap-2 bg-transparent border-primary text-primary hover:bg-primary/10"
              >
                <Eye className="w-4 h-4" />
                View {importResult.errors.length > 0 ? "Error" : "Details"}
              </Button>
            )}

            {/* Success Actions */}
            {importResult.status === "success" ||
            importResult.successfullyAdded > 0 ? (
              <>
                <Button
                  size="lg"
                  onClick={handleStartCampaign}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Send className="w-4 h-4" />
                  Start a Campaign
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleViewCommunity}
                  className="flex items-center gap-2 bg-transparent"
                >
                  View Community
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={handleGoToDashboard}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </Button>
            )}
          </motion.div>

          {/* Additional Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <Button
              variant="link"
              onClick={handleGoToDashboard}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </motion.div>

          {/* Debug Info (development only) */}
          {process.env.NODE_ENV === "development" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-4 border rounded-lg bg-muted/30 border-border"
            >
              <details>
                <summary className="text-sm font-medium cursor-pointer">
                  Debug: Import Result
                </summary>
                <pre className="mt-2 overflow-auto text-xs">
                  {JSON.stringify(importResult, null, 2)}
                </pre>
              </details>
            </motion.div>
          )}
        </div>
      </div>

      {/* Error Details Modal */}
      <ErrorDetailsModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        errors={importResult.errors}
        warnings={importResult.warnings}
      />
    </div>
  );
}
