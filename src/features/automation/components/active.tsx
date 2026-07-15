import {
  ArrowTopRightOnSquareIcon,
  BoltIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { type Automation } from "@/features/automation/types";

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
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-border bg-gradient-to-r from-muted/50 to-muted/20">
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
              <th className="w-12 px-4 py-3" />
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
                    className="font-medium text-foreground hover:text-primary transition-colors"
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
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {automation.trigger.type === "onchain" ? (
                      <BoltIcon className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <DocumentTextIcon
                        className="h-3 w-3"
                        aria-hidden="true"
                      />
                    )}
                    {automation.trigger.contract ?? automation.trigger.event}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      automation.status === "active"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {automation.status === "active" ? (
                      <span className="relative flex h-2 w-2">
                        <span className="ocs-anim-think-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400/70" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                    ) : (
                      <PauseIcon className="h-3 w-3" aria-hidden="true" />
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
                  <span className="text-sm font-medium text-primary">
                    +${(automation.revenue / 1000).toFixed(0)}k
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                        <EllipsisHorizontalIcon
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/automations/${automation.id}`}
                          className="flex items-center gap-2"
                        >
                          <ArrowTopRightOnSquareIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                          View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(automation)}
                        className="flex items-center gap-2"
                      >
                        {automation.status === "active" ? (
                          <>
                            <PauseIcon className="h-4 w-4" aria-hidden="true" />
                            Pause
                          </>
                        ) : (
                          <>
                            <PlayIcon className="h-4 w-4" aria-hidden="true" />
                            Resume
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDuplicate(automation)}
                        className="flex items-center gap-2"
                      >
                        <DocumentDuplicateIcon
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(automation)}
                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {automations.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <BoltIcon
            className="h-8 w-8 text-muted-foreground"
            aria-hidden="true"
          />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            {searchQuery ? "No matches" : "No automations yet"}
          </h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {searchQuery
              ? "Try a different search term."
              : "Create an automation to trigger personalized flows and track performance in one place."}
          </p>
          {!searchQuery && (
            <Link
              href="/automations/new-id"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
              Create automation
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
