import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  FileText,
  Play,
  Pause,
  MoreHorizontal,
  ArrowUpRight,
  Copy,
  Trash2,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Automation } from "@/features/automation/types";

interface ActiveAutomationsListProps {
  automations: Automation[];
  searchQuery: string;
  onToggleStatus: (automation: Automation) => void;
  onDuplicate: (automation: Automation) => void;
  onDelete: (automation: Automation) => void;
}

export const ActiveAutomationsList = ({
  automations,
  searchQuery,
  onToggleStatus,
  onDuplicate,
  onDelete,
}: ActiveAutomationsListProps) => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Trigger
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Entries
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Conv.
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Revenue
            </th>
            <th className="w-12 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {automations.map((automation, index) => (
            <motion.tr
              key={automation.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="border-b border-border/50 transition-colors hover:bg-muted/50"
            >
              <td className="px-6 py-4">
                <Link
                  href={`/automations/${automation.id}`}
                  className="font-medium text-foreground hover:text-emerald-600 transition-colors"
                >
                  {automation.name}
                </Link>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                  {automation.description}
                </p>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    automation.trigger.type === "onchain"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                  }`}
                >
                  {automation.trigger.type === "onchain" ? (
                    <Zap className="h-3 w-3" />
                  ) : (
                    <FileText className="h-3 w-3" />
                  )}
                  {automation.trigger.contract || automation.trigger.event}
                </span>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    automation.status === "active"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  }`}
                >
                  {automation.status === "active" ? (
                    <Play className="h-3 w-3" />
                  ) : (
                    <Pause className="h-3 w-3" />
                  )}
                  {automation.status}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <span className="text-sm text-foreground">
                  {automation.entries.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <span className="text-sm text-foreground">
                  {automation.conversions.toLocaleString()}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">
                  ({automation.conversionRate}%)
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <span className="text-sm font-medium text-emerald-600">
                  +${(automation.revenue / 1000).toFixed(0)}k
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/automations/${automation.id}`}
                        className="flex items-center gap-2"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        View details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onToggleStatus(automation)}
                      className="flex items-center gap-2"
                    >
                      {automation.status === "active" ? (
                        <>
                          <Pause className="h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Resume
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDuplicate(automation)}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(automation)}
                      className="flex items-center gap-2 text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {automations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <Zap className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            No automations found
          </h3>
          <p className="mt-1 text-muted-foreground">
            {searchQuery
              ? "Try a different search term"
              : "Create your first automation to get started"}
          </p>
          {!searchQuery && (
            <Link
              href="/automations/new-id"
              className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Create automation
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
