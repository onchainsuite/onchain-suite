"use client";

import { type ComponentType, type SVGProps } from "react";

interface AuthHeaderProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
  delay?: number;
}

/**
 * Terminal auth header — mono command eyebrow, thin Outfit title, mono subtitle.
 * Matches the landing/terminal design system.
 */
export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-8">
      <span className="os-auth-eyebrow">
        <span className="font-mono">›_</span> onchainsuite
      </span>
      <h1 className="os-auth-title">{title}</h1>
      <p className="os-auth-sub">{subtitle}</p>
    </div>
  );
}
