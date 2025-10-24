import {
  BarChart3,
  Bookmark,
  Code,
  Database,
  FileText,
  Grid3x3,
  Headphones,
  Home,
  ShoppingCart,
  TrendingUp,
  Wind,
  Zap,
} from "lucide-react";

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
