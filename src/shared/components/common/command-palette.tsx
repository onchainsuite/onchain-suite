"use client";

import {
  BarChart3,
  Calculator,
  CreditCard,
  Download,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Megaphone,
  Plus,
  Settings,
  Upload,
  User,
  Users,
} from "lucide-react";
import { type ComponentType, useCallback, useEffect } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { PRIVATE_ROUTES } from "@/config/app-routes";

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavigationItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  route: string;
  shortcut?: string;
}

interface ActionItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }

      // Add escape key handler
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  const navigateToRoute = useCallback((route: string) => {
    window.location.href = route;
  }, []);

  const openExternalLink = useCallback((url: string, target = "_blank") => {
    window.open(url, target);
  }, []);

  const navigationItems: NavigationItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      route: PRIVATE_ROUTES.DASHBOARD,
    },
    {
      label: "Campaigns",
      icon: Megaphone,
      route: PRIVATE_ROUTES.CAMPAIGNS,
    },
    {
      label: "Automation",
      icon: FileText,
      route: PRIVATE_ROUTES.AUTOMATIONS,
    },
    {
      label: "Community",
      icon: Users,
      route: PRIVATE_ROUTES.COMMUNITY,
    },
    {
      label: "Analytics",
      icon: BarChart3,
      route: PRIVATE_ROUTES.ANALYTICS,
    },
  ];

  const quickActions: ActionItem[] = [
    {
      label: "Create New Campaign",
      icon: Plus,
      action: () => navigateToRoute(PRIVATE_ROUTES.NEW_CAMPAIGN),
      shortcut: "⌘N",
    },
    {
      label: "Export Analytics",
      icon: Download,
      action: () => {
        // TODO: Implement export functionality
        console.warn("Export data");
      },
    },
    {
      label: "Import Contacts",
      icon: Upload,
      action: () => {
        // TODO: Implement import functionality
        console.warn("Import contacts");
      },
    },
  ];

  const settingsItems: ActionItem[] = [
    {
      label: "Settings",
      icon: Settings,
      action: () => navigateToRoute(PRIVATE_ROUTES.SETTINGS),
      shortcut: "⌘,",
    },
    {
      label: "Profile",
      icon: User,
      action: () => navigateToRoute(PRIVATE_ROUTES.PROFILE),
    },
    {
      label: "Billing",
      icon: CreditCard,
      action: () => navigateToRoute(PRIVATE_ROUTES.BILLING),
    },
  ];

  const helpItems: ActionItem[] = [
    {
      label: "Documentation",
      icon: FileText,
      action: () => openExternalLink("https://docs.r3tain.io"),
    },
    {
      label: "Contact Support",
      icon: HelpCircle,
      action: () => openExternalLink("mailto:support@r3tain.io", "_self"),
    },
    {
      label: "Keyboard Shortcuts",
      icon: Calculator,
      action: () => {
        // TODO: Show keyboard shortcuts modal
        console.warn("Show keyboard shortcuts");
      },
      shortcut: "⌘?",
    },
  ];

  const renderCommandItem = (
    item: NavigationItem | ActionItem,
    action: () => void
  ) => (
    <CommandItem
      key={item.label}
      onSelect={() => runCommand(action)}
      className="flex items-center gap-2 px-2 py-1.5"
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.shortcut && (
        <CommandShortcut className="ml-auto">{item.shortcut}</CommandShortcut>
      )}
    </CommandItem>
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        className="border-0 focus:ring-0"
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) =>
            renderCommandItem(item, () => navigateToRoute(item.route))
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {quickActions.map((item) => renderCommandItem(item, item.action))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          {settingsItems.map((item) => renderCommandItem(item, item.action))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Help">
          {helpItems.map((item) => renderCommandItem(item, item.action))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
