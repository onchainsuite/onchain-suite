/* eslint-disable no-console */
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { PasteArea } from "@/r3tain/community/components/import/copy-paste";
import { UploadZone } from "@/r3tain/community/components/import/file-upload";
import { ImportLayout } from "@/r3tain/community/components/import/import-layout";
import { ValidationMessages } from "@/r3tain/community/components/import/validation-messages";
import {
  ContinueButton,
  PageHeader,
} from "@/r3tain/community/components/shared";
import { useImport } from "@/r3tain/community/context";
import { useImportNavigation } from "@/r3tain/community/hooks";
import { type ValidationResult } from "@/r3tain/community/utils";

export default function UploadPage() {
  const searchParams = useSearchParams();
  const { state, updateUpload } = useImport();
  const { navigateToStep, goBack } = useImportNavigation();

  const method =
    searchParams.get("method") ?? state.selectedMethod ?? "upload-file";
  const isUploadMethod = method === "upload-file";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedData, setPastedData] = useState("");
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const handleFileSelect = (file: File, validationResult: ValidationResult) => {
    setSelectedFile(file);
    setValidation(validationResult);
    updateUpload(file, "", validationResult);
  };

  const handleDataChange = (
    data: string,
    validationResult: ValidationResult
  ) => {
    setPastedData(data);
    setValidation(validationResult);
    updateUpload(null, data, validationResult);
  };

  const handleContinue = () => {
    if (validation?.isValid) {
      navigateToStep("match");
    }
  };

  const handleBack = () => {
    goBack("");
  };

  const canContinue =
    validation?.isValid &&
    ((isUploadMethod && selectedFile) ??
      (!isUploadMethod && pastedData.trim()));

  const pageConfig = {
    "upload-file": {
      title: "Upload a file",
      subtitle:
        "Ensuring your file is formatted correctly eliminates errors and makes the import process go smoothly and faster.",
      helpLinks: [
        {
          text: "How to Format your File",
          onClick: () => console.log("Help clicked"),
        },
      ],
    },
    "copy-paste": {
      title: "Copy and Paste Your Subscribers Information",
      subtitle:
        "Ensure that your file is formatted correctly. It helps eliminate errors and makes the import process go smoother and faster.",
      helpLinks: [
        {
          text: "How to Format your File",
          onClick: () => console.log("Help clicked"),
        },
      ],
    },
  };

  const config =
    pageConfig[method as keyof typeof pageConfig] || pageConfig["upload-file"];

  return (
    <ImportLayout currentStep={1} onBack={handleBack}>
      <PageHeader {...config} />

      {isUploadMethod ? (
        <UploadZone onFileSelect={handleFileSelect} />
      ) : (
        <PasteArea onDataChange={handleDataChange} />
      )}

      <ValidationMessages validation={validation} />

      <ContinueButton onClick={handleContinue} disabled={!canContinue} />
    </ImportLayout>
  );
}
