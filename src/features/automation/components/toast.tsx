import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

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
          {type === "success" ? (
            <CheckCircleIcon
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />
          ) : (
            <ExclamationCircleIcon
              className="h-5 w-5 text-destructive"
              aria-hidden="true"
            />
          )}
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <XMarkIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
