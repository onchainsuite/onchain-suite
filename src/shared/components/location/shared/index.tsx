import { ArrowPathIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";

export const LoadingSpinner = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2">
    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
    <span>{text}</span>
  </div>
);

// Error display component
export const ErrorDisplay = ({
  onRetry,
  isFetching,
}: {
  onRetry: () => void;
  isFetching: boolean;
}) => (
  <div className="flex items-center gap-2">
    <ArrowPathIcon
      className={cn("h-4 w-4 cursor-pointer", isFetching && "animate-spin")}
      onClick={onRetry}
      aria-hidden="true"
    />
    <span className="text-destructive">Failed to load</span>
  </div>
);
