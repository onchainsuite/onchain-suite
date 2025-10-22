import {
  BarChart3,
  CircuitBoard,
  FileText,
  Inbox,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  ListCheck,
  Megaphone,
  Settings,
  Tags,
  UserCheck,
  Users,
} from "lucide-react";

import type { NavItem } from "@/types/ui";

import { r3tainRoutes } from "./app-routes";

export const dashboardNav: NavItem[] = [
  {
    href: r3tainRoutes.home,
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: r3tainRoutes.campaigns,
    icon: Megaphone,
    label: "Campaigns",
  },
  {
    href: r3tainRoutes.automation,
    icon: Layers,
    label: "Automation",
    submenu: [
      {
        href: r3tainRoutes.flows,
        label: "Flows",
        icon: CircuitBoard,
      },
      {
        href: r3tainRoutes.templates,
        label: "Templates",
        icon: LayoutTemplate,
      },
    ],
  },
  {
    href: r3tainRoutes.community,
    icon: Users,
    label: "Community",
    submenu: [
      {
        href: r3tainRoutes.subscribers,
        label: "Subscribers",
        icon: UserCheck,
      },

      {
        href: r3tainRoutes.segments,
        label: "Segments",
        icon: Layers,
      },
      {
        href: r3tainRoutes.surveys,
        label: "Surveys",
        icon: ListCheck,
      },
      {
        href: r3tainRoutes.subscriberPreferences,
        label: "Subscriber Preferences",
        icon: Settings,
      },
      {
        href: r3tainRoutes.inbox,
        label: "Inbox",
        icon: Inbox,
      },
      {
        href: r3tainRoutes.tags,
        label: "Tags",
        icon: Tags,
      },
    ],
  },
  {
    href: r3tainRoutes.analytics,
    icon: BarChart3,
    label: "Analytics",
    submenu: [
      {
        href: r3tainRoutes.reports,
        label: "Reports",
        icon: FileText,
      },
    ],
  },
];
