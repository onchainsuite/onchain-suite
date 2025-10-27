"use client";

import { Keyboard } from "lucide-react";
import * as React from "react";
import { v7 } from "uuid";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useKeyboardShortcuts } from "@/common/layout/hooks";

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps) {
  const { getModifierKey } = useKeyboardShortcuts();

  const shortcuts = [
    {
      category: "General",
      items: [
        { keys: [getModifierKey(), "J"], description: "Open command palette" },
        { keys: ["/"], description: "Quick search" },
        {
          keys: [getModifierKey(), "/"],
          description: "Show keyboard shortcuts",
        },
        { keys: ["Esc"], description: "Close dialogs and menus" },
      ],
    },
    {
      category: "Navigation",
      items: [{ keys: [getModifierKey(), "B"], description: "Toggle sidebar" }],
    },
    {
      category: "Actions",
      items: [
        {
          keys: [getModifierKey(), "⇧", "A"],
          description: "Open AI assistant",
        },
        { keys: [getModifierKey(), "."], description: "Open settings" },
      ],
    },
    {
      category: "View",
      items: [
        { keys: [getModifierKey(), "⇧", "T"], description: "Toggle theme" },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Quick access to common actions and navigation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold mb-3 text-foreground">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut) => (
                  <div
                    key={v7()}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={v7()}>
                          <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> Press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px]">
              {getModifierKey()}
            </kbd>{" "}
            +{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px]">
              J
            </kbd>{" "}
            or just{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px]">
              /
            </kbd>{" "}
            anytime to open the command palette and search for actions.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
