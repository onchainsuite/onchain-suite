import { type LucideIcon } from "lucide-react";

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
