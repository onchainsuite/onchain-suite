"use client";

import {
  CheckIcon,
  ClipboardIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/ui/button";
import { Label } from "@/ui/label";

/** Embed snippet + submit URL with copy affordances. */
export function EmbedSnippet({
  embedCode,
  submitUrl,
}: {
  embedCode: string;
  submitUrl: string;
}) {
  const [copied, setCopied] = useState<"embed" | "url" | null>(null);

  const copy = useCallback((which: "embed" | "url", value: string) => {
    void navigator.clipboard.writeText(value);
    setCopied(which);
    toast.success(
      which === "embed" ? "Embed code copied" : "Submit URL copied"
    );
    window.setTimeout(() => setCopied(null), 1500);
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Embed snippet</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copy("embed", embedCode)}
          >
            {copied === "embed" ? (
              <CheckIcon className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ClipboardIcon className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            )}
            Copy
          </Button>
        </div>
        <pre className="max-h-52 overflow-auto rounded-md border border-border bg-muted/50 p-3 font-mono text-xs text-foreground">
          {embedCode}
        </pre>
        <p className="text-xs text-muted-foreground">
          Drop this on any site to start capturing wallets.
        </p>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Submit URL</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copy("url", submitUrl)}
          >
            {copied === "url" ? (
              <CheckIcon className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <LinkIcon className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            )}
            Copy
          </Button>
        </div>
        <code className="block truncate rounded-md border border-border bg-muted/50 p-3 font-mono text-xs text-foreground">
          {submitUrl}
        </code>
      </div>
    </div>
  );
}
