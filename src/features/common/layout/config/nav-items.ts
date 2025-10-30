import {
  Activity,
  BarChart,
  BarChart3,
  Bookmark,
  CircuitBoard,
  Code,
  Code2,
  Database,
  FileText,
  FolderGit2,
  GitBranch,
  GitMerge,
  Grid3x3,
  Headphones,
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
  Server,
  Settings,
  Shield,
  ShoppingCart,
  TrendingUp,
  UserCheck,
  Users,
  Wind,
  Zap,
} from "lucide-react";

import { PRIVATE_ROUTES } from "@/config/app-routes";

import { type SidebarNavItem } from "../types";

export const dashboardNavItems: SidebarNavItem[] = [
  { title: "Home", icon: Home, href: "/" },
  { title: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
  { title: "CRM", icon: Grid3x3, href: "/crm" },
  { title: "Marketing", icon: TrendingUp, href: "/marketing" },
  {
    title: "Content",
    icon: FileText,
    submenu: [
      { title: "Website Pages", href: "/content/website" },
      { title: "Landing Pages", href: "/content/landing" },
      { title: "Blog", href: "/content/blog" },
      {
        title: "Videos",
        href: "/content/videos",
        submenu: [
          { title: "Video Library", href: "/content/videos/library" },
          { title: "Upload Video", href: "/content/videos/upload" },
          { title: "Video Settings", href: "/content/videos/settings" },
        ],
      },
      {
        title: "Podcasts",
        href: "/content/podcasts",
        submenu: [
          { title: "Episodes", href: "/content/podcasts/episodes" },
          { title: "Series", href: "/content/podcasts/series" },
        ],
      },
      {
        title: "Case Studies",
        href: "/content/case-studies",
        submenu: [
          { title: "Published", href: "/content/case-studies/published" },
          { title: "Drafts", href: "/content/case-studies/drafts" },
        ],
      },
      { title: "Embeds", href: "/content/embeds" },
      { title: "Remix", href: "/content/remix" },
      { title: "SEO", href: "/content/seo" },
      { title: "Memberships", href: "/content/memberships" },
      { title: "Design Manager", href: "/content/design" },
      { title: "Brand", href: "/content/brand", badge: "Beta" },
    ],
  },
  { title: "Sales", icon: ShoppingCart, href: "/sales" },
  { title: "Commerce", icon: ShoppingCart, href: "/commerce" },
  {
    title: "Service",
    icon: Headphones,
    submenu: [
      { title: "Help Desk", href: "/service/help-desk" },
      { title: "Customer Success", href: "/service/customer-success" },
      { title: "Customer Agent", href: "/service/customer-agent" },
      { title: "Chatflows", href: "/service/chatflows" },
      { title: "Knowledge Base", href: "/service/knowledge-base" },
      { title: "Customer Portal", href: "/service/customer-portal" },
      { title: "Feedback Surveys", href: "/service/feedback-surveys" },
      { title: "Service Analytics", href: "/service/analytics" },
    ],
  },
  { title: "Data Management", icon: Database, href: "/data" },
  { title: "Automation", icon: Zap, href: "/automation" },
  { title: "Reporting", icon: BarChart3, href: "/reporting" },
  { title: "Breeze", icon: Wind, href: "/breeze" },
  { title: "Development", icon: Code, href: "/development" },
];

export const PLATFORM_NAVIGATION: SidebarNavItem[] = [
  { title: "Home", icon: Home, href: PRIVATE_ROUTES.ROOT },
  // R3TAIN
  {
    title: "R3tain",
    icon: LayoutDashboard,
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
    icon: Server,
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
    icon: FolderGit2,
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
      {
        title: "Segments",
        icon: Users,
        href: PRIVATE_ROUTES.ONCHAIN.SEGMENTS,
      },
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
