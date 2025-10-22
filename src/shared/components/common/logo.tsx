import { Blocks } from "lucide-react";

interface LogoProps {
  className?: string;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export function Logo({ className, isCollapsed, onClick }: LogoProps) {
  return (
    <button
      type="button"
      className={`flex cursor-pointer items-center gap-3 ${className}`}
      onClick={onClick}
    >
      <div className="from-primary to-primary/80 text-primary-foreground shadow-primary/20 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br shadow-md">
        <Blocks className="h-5 w-5" />
      </div>

      {!isCollapsed && (
        <div className="text-foreground flex items-baseline font-bold">
          <span>R</span>
          <span className="text-primary">3</span>
          <span>tain</span>
        </div>
      )}
    </button>
  );
}
