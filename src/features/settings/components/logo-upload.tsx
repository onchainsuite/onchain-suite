import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Progress } from "@/shared/components/ui/progress";

interface LogoUploadProps {
  showLogoUploadModal: boolean;
  setShowLogoUploadModal: (show: boolean) => void;
  logoUploadType: "primary" | "dark" | "favicon";
}

const LogoUpload = ({
  showLogoUploadModal,
  setShowLogoUploadModal,
  logoUploadType,
}: LogoUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = authClient.useSession();
  const { mutate } = useSWRConfig();

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [selectedFile] = e.target.files ?? [];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 100MB limit");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(selectedFile);
    setUploadProgress(0);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 100MB limit");
      return;
    }

    setSaving(true);
    setUploadProgress(0);
    setSuccess(false);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // axios automatically sets the correct Content-Type with boundary for FormData
      // Do NOT set it manually, otherwise the boundary will be missing
      const headers: Record<string, string> = {};

      const activeOrgId = session?.session?.activeOrganizationId;
      if (!activeOrgId) {
        toast.error(
          "No active organization found. Please select an organization."
        );
        setSaving(false);
        return;
      }

      headers["x-org-id"] = activeOrgId;

      // Use the custom proxy route to avoid rewrite issues
      await axios.post(`/api/upload/logo/${logoUploadType}`, formData, {
        headers,
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total ?? file.size;
          const current = progressEvent.loaded;
          const percentCompleted = Math.round((current * 100) / total);
          setUploadProgress(percentCompleted);
        },
      });

      toast.success("Logo uploaded successfully");

      // Update the logo across the app without reload
      mutate("/api/v1/organization/branding");

      // Close modal and reset state
      setTimeout(() => {
        setShowLogoUploadModal(false);
        setFile(null);
        setUploadProgress(0);
        setSaving(false);
      }, 1500);

      setSuccess(true);
    } catch (error: any) {
      console.error("Upload error object:", error);
      if (error.response) {
        console.error("Upload error response status:", error.response.status);
        console.error("Upload error response data:", error.response.data);
      }

      let errorMessage = "Failed to upload logo";

      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData.error === "string") {
          errorMessage = errorData.error;
        } else if (typeof errorData.details === "string") {
          errorMessage = errorData.details;
        } else if (errorData.error && typeof errorData.error === "object") {
          // Handle structured error object
          if (errorData.error.message) {
            errorMessage = errorData.error.message;
          } else {
            errorMessage = JSON.stringify(errorData.error);
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setSaving(false);
      setSuccess(false);
    }
  };

  return (
    <Dialog open={showLogoUploadModal} onOpenChange={setShowLogoUploadModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-tight text-(--brand-oxford-blue) dark:text-(--brand-alice-blue)">
            Upload{" "}
            {logoUploadType === "primary"
              ? "primary"
              : logoUploadType === "dark"
                ? "dark mode"
                : "favicon"}{" "}
            logo
          </DialogTitle>
          <DialogDescription className="text-(--brand-oxford-blue)/70 dark:text-(--brand-alice-blue)/70">
            {logoUploadType === "favicon"
              ? "Upload a 32×32px icon"
              : "Upload a 400×100px image"}
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="mt-6 flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Upload Complete!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your logo has been updated successfully.
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept={
                logoUploadType === "favicon"
                  ? ".ico,.png"
                  : ".svg,.png,.jpg,.jpeg"
              }
              onChange={handleFileChange}
            />
            <motion.div
              whileHover={{
                borderColor: "var(--brand-blue)",
                backgroundColor: "rgba(23, 39, 224, 0.05)",
              }}
              onClick={() => !saving && fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-(--brand-oxford-blue)/20 bg-(--brand-alice-blue)/50 p-10 transition-all ${!saving ? "cursor-pointer" : "cursor-default"} dark:border-(--brand-alice-blue)/20 dark:bg-(--brand-alice-blue)/5 lg:p-12`}
            >
              {file ? (
                <div className="text-center w-full">
                  <p className="font-medium text-(--brand-oxford-blue) dark:text-(--brand-alice-blue)">
                    {file.name}
                  </p>
                  <p className="text-sm text-(--brand-oxford-blue)/70 dark:text-(--brand-alice-blue)/70 mb-4">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  {saving && (
                    <div className="w-full max-w-xs mx-auto space-y-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {uploadProgress}% uploaded
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-(--brand-oxford-blue)/50 dark:text-(--brand-alice-blue)/50" />
                  <p className="mt-4 text-sm font-medium text-(--brand-oxford-blue) dark:text-(--brand-alice-blue)">
                    Drop your file here, or browse
                  </p>
                  <p className="mt-1 text-xs text-(--brand-oxford-blue)/70 dark:text-(--brand-alice-blue)/70">
                    SVG, PNG up to 100MB
                  </p>
                </>
              )}
              {!file && (
                <Button
                  variant="outline"
                  className="mt-6 border-(--brand-oxford-blue)/20 bg-transparent text-(--brand-oxford-blue) dark:border-(--brand-alice-blue)/20 dark:text-(--brand-alice-blue)"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Choose file
                </Button>
              )}
              {file && !saving && (
                <Button
                  variant="outline"
                  className="mt-6 border-(--brand-oxford-blue)/20 bg-transparent text-(--brand-oxford-blue) dark:border-(--brand-alice-blue)/20 dark:text-(--brand-alice-blue)"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Change file
                </Button>
              )}
            </motion.div>
          </div>
        )}
        <DialogFooter className="mt-6 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setShowLogoUploadModal(false)}
            disabled={saving}
            className="border-(--brand-oxford-blue)/20 text-(--brand-oxford-blue) dark:border-(--brand-alice-blue)/20 dark:text-(--brand-alice-blue)"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={saving || !file}
            className="bg-(--brand-blue) text-white hover:bg-(--brand-blue)/30"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Upload logo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoUpload;
