interface ProgressBarProps {
  value: number;
  className?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  className = "",
  animated = false,
}: ProgressBarProps) {
  return (
    <div
      className={`h-2 w-full bg-muted rounded-full overflow-hidden ${className}`}
    >
      <div
        className={`h-full bg-linear-to-r from-primary to-secondary ${animated ? "animate-pulse" : ""}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
