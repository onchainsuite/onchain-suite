import { RefreshCw } from "lucide-react";

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
    <RefreshCw
      className={cn("h-4 w-4 cursor-pointer", isFetching && "animate-spin")}
      onClick={onRetry}
    />
    <span className="text-destructive">Failed to load</span>
  </div>
);
