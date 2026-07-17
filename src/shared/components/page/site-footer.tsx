import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "border-t border-border/60 px-6 py-8 text-center text-xs text-muted-foreground",
        className
      )}
    >
      © {new Date().getFullYear()} OnchainSuite Incorporated
    </footer>
  );
}
