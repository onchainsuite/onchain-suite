import { motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

import { type Automation } from "@/features/automation/types";

interface DeleteModalProps {
  show: boolean;
  automation: Automation | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal = ({
  show,
  automation,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteModalProps) => {
  if (!show || !automation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Delete Automation?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete &quot;{automation.name}&quot;? This
          action cannot be undone and will stop all active triggers.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Automation"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
