import { AlertCircleIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  show: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export const Toast = ({ show, message, type, onClose }: ToastProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-lg"
        >
          <div
            className={`rounded-full p-1 ${
              type === "success"
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <HugeiconsIcon icon={AlertCircleIcon} className="h-4 w-4" />
            )}
          </div>
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
