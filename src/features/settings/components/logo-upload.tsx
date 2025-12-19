import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Upload } from "lucide-react";
import React from "react";

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
  saving: boolean;
  handleSave: (callback: () => void) => void;
}

const LogoUpload = ({
  showLogoUploadModal,
  setShowLogoUploadModal,
  logoUploadType,
  saving,
  handleSave,
}: LogoUploadProps) => {
  return (
    <div>
      {/* Modals with slide-up animation */}
      <AnimatePresence>
        {showLogoUploadModal && (
          <Dialog
            open={showLogoUploadModal}
            onOpenChange={setShowLogoUploadModal}
          >
            <DialogContent className="sm:max-w-md" asChild>
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 20, scale: 0.95 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", damping: 25, stiffness: 300 },
                  },
                  exit: {
                    opacity: 0,
                    y: 20,
                    scale: 0.95,
                    transition: { duration: 0.2 },
                  },
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                className={undefined}
              >
                <DialogHeader>
                  <DialogTitle className="text-xl font-light tracking-tight text-[#111827]">
                    Upload{" "}
                    {logoUploadType === "primary"
                      ? "primary"
                      : logoUploadType === "dark"
                        ? "dark mode"
                        : "favicon"}{" "}
                    logo
                  </DialogTitle>
                  <DialogDescription className="text-[#6b7280]">
                    {logoUploadType === "favicon"
                      ? "Upload a 32×32px icon"
                      : "Upload a 400×100px image"}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6">
                  <motion.div
                    whileHover={{
                      borderColor: "#10b981",
                      backgroundColor: "rgba(16, 185, 129, 0.05)",
                    }}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-10 transition-all lg:p-12"
                  >
                    <Upload className="h-10 w-10 text-[#9ca3af]" />
                    <p className="mt-4 text-sm font-medium text-[#111827]">
                      Drop your file here, or browse
                    </p>
                    <p className="mt-1 text-xs text-[#6b7280]">
                      SVG, PNG up to 2MB
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6 border-gray-200/80 bg-transparent"
                    >
                      Choose file
                    </Button>
                  </motion.div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowLogoUploadModal(false)}
                    className="border-gray-200/80"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      handleSave(() => setShowLogoUploadModal(false))
                    }
                    disabled={saving}
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Upload
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogoUpload;
