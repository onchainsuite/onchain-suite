import { Button } from "@/ui/button";

import { type Log, type LogListProps, type LogPaginationProps } from "../types";
import { DetailedLogCard } from "./detailed-log-card";

export function LogPagination({
  total = 46523,
  current = 5,
  onPrevious,
  onNext,
}: LogPaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing 1-{current} of {total.toLocaleString()} logs
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onPrevious}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}

// Log List Component
export function LogList({ logs, filterLevel = null }: LogListProps) {
  const filteredLogs: Log[] = filterLevel
    ? logs.filter((log) => log.level === filterLevel)
    : logs;

  return (
    <div className="space-y-2">
      {filteredLogs.map((log) => (
        <DetailedLogCard key={log.id} {...log} />
      ))}
    </div>
  );
}
