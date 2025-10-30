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
  icon?: LucideIcon;
  roles?: string[];
  submenu?: {
    title: string;
    href: string;
    icon?: LucideIcon;
    roles?: string[];
  }[];
}

export interface SidebarNavItem {
  title: string;
  icon?: LucideIcon | string;
  href?: string;
  roles?: string[];
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
