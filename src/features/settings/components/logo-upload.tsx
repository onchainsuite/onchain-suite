import { motion } from "framer-motion";
import { Loader2, Upload } from "lucide-react";
import React, { useState, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setSaving(true);
    const formData = new FormData();
    formData.append("file", file);

    const endpointMap = {
      primary: "/api/v1/organization/branding/logo/primary",
      dark: "/api/v1/organization/branding/logo/dark",
      favicon: "/api/v1/organization/branding/logo/favicon",
    };

    try {
      const response = await fetch(endpointMap[logoUploadType], {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Logo uploaded successfully");
        setShowLogoUploadModal(false);
        setFile(null);
        // Reload to show changes or update context if we had one.
        // A full reload ensures new logos are fetched if they are cached or used in layout.
        window.location.reload();
      } else {
        toast.error("Failed to upload logo");
      }
    } catch (error) {
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
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-(--brand-oxford-blue)/20 bg-(--brand-alice-blue)/50 p-10 transition-all cursor-pointer dark:border-(--brand-alice-blue)/20 dark:bg-(--brand-alice-blue)/5 lg:p-12"
          >
            {file ? (
              <div className="text-center">
                <p className="font-medium text-(--brand-oxford-blue) dark:text-(--brand-alice-blue)">
                  {file.name}
                </p>
                <p className="text-sm text-(--brand-oxford-blue)/70 dark:text-(--brand-alice-blue)/70">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-(--brand-oxford-blue)/50 dark:text-(--brand-alice-blue)/50" />
                <p className="mt-4 text-sm font-medium text-(--brand-oxford-blue) dark:text-(--brand-alice-blue)">
                  Drop your file here, or browse
                </p>
                <p className="mt-1 text-xs text-(--brand-oxford-blue)/70 dark:text-(--brand-alice-blue)/70">
                  SVG, PNG up to 2MB
                </p>
              </>
            )}
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
          </motion.div>
        </div>
        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => setShowLogoUploadModal(false)}
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
