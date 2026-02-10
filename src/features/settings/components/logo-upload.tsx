import { motion } from "framer-motion";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import axios from "axios";

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
import { authClient } from "@/lib/auth-client";

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

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 100MB limit");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(selectedFile);
      setUploadProgress(0);
      setSuccess(false);
    }
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

    const endpointMap = {
      primary: "/api/v1/organization/branding/logo/primary",
      dark: "/api/v1/organization/branding/logo/dark",
      favicon: "/api/v1/organization/branding/logo/favicon",
    };

    try {
      const headers: Record<string, string> = {
        "Content-Type": "multipart/form-data",
      };
      if (session?.session?.activeOrganizationId) {
        headers["x-org-id"] = session.session.activeOrganizationId;
      }

      await axios.post(endpointMap[logoUploadType], formData, {
        headers,
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || file.size;
          const current = progressEvent.loaded;
          const percentCompleted = Math.round((current * 100) / total);
          setUploadProgress(percentCompleted);
        },
      });

      toast.success("Logo uploaded successfully");
      setShowLogoUploadModal(false);
      setFile(null);
      setUploadProgress(0);
      // Reload to show changes or update context if we had one.
      // A full reload ensures new logos are fetched if they are cached or used in layout.
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload logo");
    } finally {
      setSaving(false);
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
