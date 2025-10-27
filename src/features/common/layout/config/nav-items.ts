import {
  Activity,
  BarChart,
  BarChart3,
  Bookmark,
  CircuitBoard,
  Code,
  Database,
  FileText,
  FolderGit2,
  GitMerge,
  Grid3x3,
  Headphones,
  Home,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  Mail,
  Megaphone,
  PieChart,
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
        title: "Profiles",
        icon: Users,
        href: PRIVATE_ROUTES.BRIDGE.PROFILES.ROOT,
      },
      {
        title: "Events",
        icon: Activity,
        href: PRIVATE_ROUTES.BRIDGE.EVENTS.ROOT,
      },
      {
        title: "Analytics",
        icon: BarChart,
        href: PRIVATE_ROUTES.BRIDGE.ANALYTICS.ROOT,
      },
      {
        title: "Logs",
        icon: Database,
        href: PRIVATE_ROUTES.BRIDGE.LOGS.ROOT,
      },
      {
        title: "Security",
        icon: Shield,
        href: PRIVATE_ROUTES.BRIDGE.SECURITY.ROOT,
      },
      {
        title: "SDK",
        icon: Server,
        href: PRIVATE_ROUTES.BRIDGE.SDK.ROOT,
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
