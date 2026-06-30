import {
  ArchiveBoxIcon,
  CheckIcon,
  PaperAirplaneIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface FloatingBulkProps {
  selectedThreadIds: string[];
  setSelectedThreadIds: (ids: string[]) => void;
}

const FloatingBulk = ({
  selectedThreadIds,
  setSelectedThreadIds,
}: FloatingBulkProps) => {
  return (
    <AnimatePresence>
      {selectedThreadIds.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-lg"
        >
          <span className="text-sm font-medium text-foreground">
            {selectedThreadIds.length} selected
          </span>
          <div className="h-4 w-px bg-border" />
          <button
            type="button"
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Send"
          >
            <PaperAirplaneIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-amber-500"
            title="Star"
          >
            <StarIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Archive"
          >
            <ArchiveBoxIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedThreadIds([])}
            className="ml-auto rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Clear selection"
          >
            <CheckIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default FloatingBulk;
