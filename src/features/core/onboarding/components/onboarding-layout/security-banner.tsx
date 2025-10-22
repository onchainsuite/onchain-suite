import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SecurityBanner({ onRemove }: { onRemove: () => void }) {
  return (
    <div className="bg-slate-700 px-4 py-3 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            <span className="text-xs font-bold">!</span>
          </div>
          <p className="text-sm">
            <span className="font-medium">Reminder:</span> Onchain Suite will
            never call, email, or text you for your password or 1-time passcode.{" "}
            <button className="underline hover:no-underline">
              Learn more about security
            </button>
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
