import type { LucideIcon } from "lucide-react";
import type { ElementType } from "react";

export interface NavItem {
  href: string;
  icon: ElementType;
  label: string;
  badge?: string;
  submenu?: NavItem[];
}

export interface CrumbItem extends Omit<NavItem, "submenu" | "icon"> {
  icon?: ElementType;
}

export type Primitive = string | number | Date | boolean | null | undefined;

export interface Particle {
  left: string;
  top?: string;
  delay: number;
  width?: number;
  duration: number;
}

export interface FloatingIcon {
  icon: LucideIcon;
  left: string;
  top: string;
  delay: number;
  duration: number;
  scale: number;
}
