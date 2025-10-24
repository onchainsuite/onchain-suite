"use client";

import {
  HelpCircle,
  Keyboard,
  Phone,
  Plus,
  Settings,
  Video,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { NotificationsCenter } from "@/common/layout/components/notifications";
import { useKeyboardShortcuts } from "@/common/layout/hooks";

interface ActionButtonsProps {
  onShowShortcuts?: () => void;
}

export const ActionButtons = React.memo(function ActionButtons({
  onShowShortcuts,
}: ActionButtonsProps) {
  const { getModifierKey } = useKeyboardShortcuts();

  return (
    <TooltipProvider>
      <div className="hidden lg:flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-foreground/10"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create New</p>
          </TooltipContent>
        </Tooltip>

        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-foreground/10"
        >
          <Phone className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-foreground/10"
        >
          <Video className="h-5 w-5" />
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-foreground/10"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Help</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-foreground/10"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              <span>Settings</span>
              <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border bg-muted px-1 font-mono text-[9px] font-medium">
                {getModifierKey()}.
              </kbd>
            </div>
          </TooltipContent>
        </Tooltip>

        <NotificationsCenter />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-foreground/10"
              onClick={onShowShortcuts}
            >
              <Keyboard className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              <span>Keyboard Shortcuts</span>
              <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border bg-muted px-1 font-mono text-[9px] font-medium">
                {getModifierKey()}/
              </kbd>
            </div>
          </TooltipContent>
        </Tooltip>

        <Button
          variant="ghost"
          className="hidden md:flex text-sidebar-foreground hover:bg-sidebar-foreground/10 gap-2 px-3"
        >
          <span className="text-sm">Assistant</span>
        </Button>
      </div>
    </TooltipProvider>
  );
});
