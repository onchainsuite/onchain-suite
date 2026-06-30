"use client";

import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Terminal auth shell — deep-navy canvas with a blueprint grid + glow, holding a
 * sharp-cornered "terminal window" card. `.os-auth` remaps the shadcn theme
 * tokens to the terminal palette (see globals.css / design.md) so the form
 * controls inside recolor and go square automatically. Shared by signin,
 * signup, forgot-password and reset-password views.
 */
export function AuthLayout({ children, className = "" }: AuthLayoutProps) {
  return (
    <div className="os-auth">
      <div className={`os-auth-shell ${className}`}>
        <div className="os-auth-card">
          <div className="os-auth-bar">
            <i />
            <i />
            <i />
            <span>onchainsuite — auth</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
