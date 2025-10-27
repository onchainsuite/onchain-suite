/* eslint-disable no-console */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ImportLayout } from "@/r3tain/community/components/import/import-layout";
import {
  MethodGrid,
  MobileImportSection,
} from "@/r3tain/community/components/import/method-selection";
import {
  ContinueButton,
  PageHeader,
} from "@/r3tain/community/components/shared";
import { useImport } from "@/r3tain/community/context";
import { useImportNavigation } from "@/r3tain/community/hooks";

export default function AddSubscribersPage() {
  const { back } = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const { updateMethod } = useImport();
  const { navigateToStep } = useImportNavigation();

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    updateMethod(methodId);
  };

  const handleContinue = () => {
    if (selectedMethod) {
      // Route to different flows based on method
      if (selectedMethod === "import-service") {
        // External services flow - go directly to connect page
        navigateToStep("connect");
      } else {
        // Manual import flow - go to upload page
        navigateToStep("upload", { method: selectedMethod });
      }
    }
  };

  const handleHelpClick = (helpText: string) => {
    console.log("Show help for:", helpText);
  };

  const handleMobileAction = (action: string) => {
    console.log("Mobile action:", action);
  };

  return (
    <ImportLayout currentStep={0} showBreadcrumb={true} onBack={back}>
      <PageHeader
        title="How would you like to Add Subscribers?"
        subtitle="Your subscribers are the people who make up your Community and whom you'll be sending emails to. In this and the following steps, we'll help you import your subscriber data."
      />

      <MethodGrid
        selectedMethod={selectedMethod}
        onMethodSelect={handleMethodSelect}
        onHelpClick={handleHelpClick}
      />

      <ContinueButton onClick={handleContinue} disabled={!selectedMethod} />

      <MobileImportSection onMobileAction={handleMobileAction} />
    </ImportLayout>
  );
}
