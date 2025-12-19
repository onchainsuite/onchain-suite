import { motion } from "framer-motion";
import { ArrowUpRight, FileText, MoreHorizontal } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { type Draft } from "@/features/automation/types";

interface DraftsListProps {
  drafts: Draft[];
}

export const DraftsList = ({ drafts }: DraftsListProps) => {
  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border border-dashed py-16 text-center">
        <div className="mb-4 rounded-full bg-secondary p-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground">No drafts yet</h3>
        <p className="mt-1 text-muted-foreground">
          Start creating a new automation to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {drafts.map((draft) => (
        <motion.div
          key={draft.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-secondary p-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-destructive">
                  Delete draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h3 className="font-semibold text-foreground">{draft.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {draft.description}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Edited {draft.lastEdited}</span>
            <Link
              href={`/automations/${draft.id}`}
              className="flex items-center gap-1 font-medium text-primary hover:text-primary/90"
            >
              Continue editing
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
