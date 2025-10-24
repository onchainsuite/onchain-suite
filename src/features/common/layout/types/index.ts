import { type LucideIcon } from "lucide-react";

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
}

export interface SubmenuItem {
  title: string;
  href: string;
  badge?: string;
  submenu?: {
    title: string;
    href: string;
  }[];
}

export interface SidebarNavItem {
  title: string;
  icon: LucideIcon;
  href?: string;
  submenu?: SubmenuItem[];
}

export interface SearchSuggestion {
  title: string;
  href: string;
  category: string;
}

export type SearchItem =
  | { type: "recent"; data: RecentSearch; index: number }
  | { type: "suggestion"; data: SearchSuggestion; index: number };
