import {
  Activity,
  BarChart,
  BarChart3,
  Bot,
  CircuitBoard,
  Code,
  Code2,
  FileText,
  FolderGit2,
  GitBranch,
  GitMerge,
  Home,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  Lock,
  Mail,
  Megaphone,
  Package,
  PieChart,
  Puzzle,
  Settings,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { type SidebarNavItem } from "@/common/layout/types";

export const PLATFORM_NAVIGATION: SidebarNavItem[] = [
  { title: "Home", icon: Home, href: PRIVATE_ROUTES.ROOT },
  // R3TAIN
  {
    title: "R3tain",
    icon: "https://res.cloudinary.com/dwnkqkx8q/image/upload/v1761714418/R_Icon_Gradient_Blue_jasvew.png",
    submenu: [
      {
        title: "Overview",
        href: PRIVATE_ROUTES.R3TAIN.OVERVIEW,
      },
      {
        title: "Campaigns",
        icon: Mail,
        href: "",
        submenu: [
          {
            title: "All Campaigns",
            href: PRIVATE_ROUTES.R3TAIN.CAMPAIGNS,
            icon: Megaphone,
          },
          {
            title: "Create Campaign",
            href: PRIVATE_ROUTES.R3TAIN.NEW_CAMPAIGN,
          },
        ],
      },
      {
        title: "Automation",
        icon: GitMerge,
        href: "",
        submenu: [
          {
            title: "Flows",
            href: PRIVATE_ROUTES.R3TAIN.FLOWS,
            icon: CircuitBoard,
          },
          {
            title: "Templates",
            href: PRIVATE_ROUTES.R3TAIN.TEMPLATES,
            icon: LayoutTemplate,
          },
        ],
      },
      {
        title: "Analytics",
        icon: BarChart,
        href: PRIVATE_ROUTES.R3TAIN.ANALYTICS,
      },
      {
        title: "Community",
        icon: Users,
        href: "",
        submenu: [
          {
            title: "Subscribers",
            href: PRIVATE_ROUTES.R3TAIN.SUBSCRIBERS,
            icon: UserCheck,
          },
          {
            title: "Segments",
            href: PRIVATE_ROUTES.R3TAIN.SEGMENTS,
            icon: Layers,
          },
        ],
      },
      {
        title: "Settings",
        icon: Settings,
        href: PRIVATE_ROUTES.R3TAIN.SETTINGS,
      },
    ],
  },

  // BRIDGE
  {
    title: "3ridge",
    icon: "https://res.cloudinary.com/dwnkqkx8q/image/upload/v1761714419/B_Icon_Gradient_Blue_v6ttgj.png",
    submenu: [
      {
        title: "Overview",
        href: PRIVATE_ROUTES.BRIDGE.ROOT,
        icon: LayoutDashboard,
      },
      {
        title: "Auth",
        icon: Shield,
        href: "#",
        submenu: [
          { title: "Wallets", href: PRIVATE_ROUTES.BRIDGE.AUTH.WALLETS },
          { title: "Email", href: PRIVATE_ROUTES.BRIDGE.AUTH.EMAIL },
          { title: "OAuth", href: PRIVATE_ROUTES.BRIDGE.AUTH.OAUTH },
          { title: "Biometric", href: PRIVATE_ROUTES.BRIDGE.AUTH.BIOMETRIC },
          { title: "Settings", href: PRIVATE_ROUTES.BRIDGE.AUTH.SETTINGS },
        ],
      },
      {
        title: "Profiles",
        icon: Users,
        href: PRIVATE_ROUTES.BRIDGE.PROFILES.ROOT,
        submenu: [
          { title: "All Profiles", href: PRIVATE_ROUTES.BRIDGE.PROFILES.ROOT },
          { title: "Merge Tool", href: PRIVATE_ROUTES.BRIDGE.PROFILES.MERGE },
        ],
      },
      {
        title: "Events",
        icon: Activity,
        href: PRIVATE_ROUTES.BRIDGE.EVENTS.ROOT,
        submenu: [
          { title: "Live", href: PRIVATE_ROUTES.BRIDGE.EVENTS.LIVE },
          { title: "History", href: PRIVATE_ROUTES.BRIDGE.EVENTS.HISTORY },
          { title: "Rules", href: PRIVATE_ROUTES.BRIDGE.EVENTS.RULES },
        ],
      },
      {
        title: "Routes",
        icon: GitBranch,
        href: PRIVATE_ROUTES.BRIDGE.ROUTES.ROOT,
        submenu: [
          { title: "Webhooks", href: PRIVATE_ROUTES.BRIDGE.ROUTES.WEBHOOKS },
          { title: "Simulator", href: PRIVATE_ROUTES.BRIDGE.ROUTES.SIMULATOR },
          { title: "Policies", href: PRIVATE_ROUTES.BRIDGE.ROUTES.POLICIES },
        ],
      },
      {
        title: "Analytics",
        icon: BarChart3,
        href: PRIVATE_ROUTES.BRIDGE.ANALYTICS.ROOT,
      },
      {
        title: "Playground",
        href: PRIVATE_ROUTES.BRIDGE.PLAYGROUND.ROOT,
        icon: Code2,
      },
      {
        title: "SDK",
        icon: Package,
        href: PRIVATE_ROUTES.BRIDGE.SDK.ROOT,
        submenu: [
          { title: "Setup", href: PRIVATE_ROUTES.BRIDGE.SDK.SETUP },
          { title: "Examples", href: PRIVATE_ROUTES.BRIDGE.SDK.EXAMPLES },
          { title: "Chains", href: PRIVATE_ROUTES.BRIDGE.SDK.CHAINS },
          { title: "API Keys", href: PRIVATE_ROUTES.BRIDGE.SDK.API_KEYS },
        ],
      },
      {
        title: "Integrations",
        icon: Puzzle,
        href: PRIVATE_ROUTES.BRIDGE.INTEGRATIONS.ROOT,
        submenu: [
          { title: "R3tain", href: PRIVATE_ROUTES.BRIDGE.INTEGRATIONS.R3TAIN },
          { title: "Onch3n", href: PRIVATE_ROUTES.BRIDGE.INTEGRATIONS.ONCH3N },
          {
            title: "Third-Party",
            href: PRIVATE_ROUTES.BRIDGE.INTEGRATIONS.THIRDPARTY,
          },
        ],
      },
      {
        title: "Security",
        href: PRIVATE_ROUTES.BRIDGE.SECURITY.ROOT,
        icon: Lock,
      },
      { title: "Logs", href: PRIVATE_ROUTES.BRIDGE.LOGS.ROOT, icon: FileText },
      {
        title: "Settings",
        href: PRIVATE_ROUTES.BRIDGE.SETTINGS.ROOT,
        icon: Settings,
      },
    ],
  },

  // ONCHAIN
  {
    title: "Onchain",
    icon: "https://res.cloudinary.com/dwnkqkx8q/image/upload/v1761714420/O_Icon_Gradient_Blue_wqzgcg.png",
    submenu: [
      {
        title: "Overview",
        icon: LayoutDashboard,
        href: PRIVATE_ROUTES.ONCHAIN.OVERVIEW,
      },
      {
        title: "Data",
        icon: FolderGit2,
        href: PRIVATE_ROUTES.ONCHAIN.DATA,
      },
      {
        title: "Insights",
        icon: PieChart,
        href: PRIVATE_ROUTES.ONCHAIN.INSIGHTS,
      },
      { title: "Assistant", href: PRIVATE_ROUTES.ONCHAIN.ASSISTANT, icon: Bot },
      {
        title: "Segments",
        icon: Users,
        href: PRIVATE_ROUTES.ONCHAIN.SEGMENTS,
      },
      { title: "API", href: PRIVATE_ROUTES.ONCHAIN.API, icon: Code },
      {
        title: "Alerts",
        icon: Shield,
        href: PRIVATE_ROUTES.ONCHAIN.ALERTS,
      },
      {
        title: "Settings",
        icon: Settings,
        href: PRIVATE_ROUTES.ONCHAIN.SETTINGS,
      },
    ],
  },

  {
    title: "Settings",
    icon: Settings,
    href: PRIVATE_ROUTES.SETTINGS,
  },
];
