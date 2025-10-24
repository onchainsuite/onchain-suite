import { type SearchSuggestion } from "@/common/layout/types";

export const searchSuggestions: SearchSuggestion[] = [
  { title: "Home", href: "/", category: "Navigation" },
  { title: "Bookmarks", href: "/bookmarks", category: "Navigation" },
  { title: "CRM", href: "/crm", category: "Navigation" },
  { title: "Marketing", href: "/marketing", category: "Navigation" },
  { title: "Website Pages", href: "/content/website", category: "Content" },
  { title: "Landing Pages", href: "/content/landing", category: "Content" },
  { title: "Blog", href: "/content/blog", category: "Content" },
  { title: "Videos", href: "/content/videos", category: "Content" },
  {
    title: "Video Library",
    href: "/content/videos/library",
    category: "Content",
  },
  { title: "Podcasts", href: "/content/podcasts", category: "Content" },
  { title: "Case Studies", href: "/content/case-studies", category: "Content" },
  { title: "SEO", href: "/content/seo", category: "Content" },
  { title: "Sales", href: "/sales", category: "Navigation" },
  { title: "Commerce", href: "/commerce", category: "Navigation" },
  { title: "Help Desk", href: "/service/help-desk", category: "Service" },
  {
    title: "Customer Success",
    href: "/service/customer-success",
    category: "Service",
  },
  {
    title: "Knowledge Base",
    href: "/service/knowledge-base",
    category: "Service",
  },
  { title: "Data Management", href: "/data", category: "Navigation" },
  { title: "Automation", href: "/automation", category: "Navigation" },
  { title: "Reporting", href: "/reporting", category: "Navigation" },
  { title: "Development", href: "/development", category: "Navigation" },
];
