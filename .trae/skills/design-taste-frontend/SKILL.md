---
name: "design-taste-frontend"
description: "Anti-generic UI taste + engineering rules. Invoke when designing/redesigning marketing pages, key app surfaces, or polishing UI to avoid common LLM layout/typography/motion clichés."
---

# Design Taste (Frontend)

Adapted from: https://github.com/Leonxlnx/taste-skill

## Design Read
Before writing UI code, state one line:
Reading this as: <page kind> for <audience>, with a <vibe>, leaning toward <system/aesthetic>.

## Dials (Global Defaults)
- DESIGN_VARIANCE: 8 (1 = perfect symmetry, 10 = artsy chaos)
- MOTION_INTENSITY: 6 (1 = static, 10 = cinematic)
- VISUAL_DENSITY: 4 (1 = airy, 10 = cockpit dense)

Use these defaults unless the user explicitly asks for a different vibe. Do not ask the user to edit this file.

## Hard Constraints (Engineering)
- Dependency verification: check package.json before importing any new library. Do not assume dependencies exist.
- Next.js/RSC: keep layouts server-first, isolate interactive/motion components as leaf client components.
- Tailwind: match the repo version; do not use Tailwind v4 patterns in a v3 project.
- Viewport stability: avoid h-screen for full-height hero; prefer min-h-[100dvh].
- Layout mechanics: prefer CSS Grid over flex math for multi-column layouts.

## Bias Corrections (What to Avoid)
- No default centered hero + three equal feature cards unless explicitly requested.
- No generic "AI purple/blue neon" glow look by default.
- No oversized wrapped H1. Keep headlines to 1-2 lines at desktop.
- No placeholder-as-label forms. Labels above inputs, errors below.
- No sloppy spacing. Align to a coherent rhythm and container width.

## Typography Rules
- Headlines: track-tight, controlled scale, do not scream.
- Body: readable leading, cap line length around ~65ch.
- Prefer distinctive modern sans (Geist/Outfit/Cabinet Grotesk/Satoshi) when the brief calls for premium or creative.
- For dashboards/software UIs: keep typography utilitarian (sans + mono pairing), do not introduce decorative serif.

## Color Rules
- One accent color per page/surface. Keep saturation restrained.
- Stick to one neutral temperature. Do not mix warm and cool grays across the same surface.
- Avoid pure black (#000000). Use off-black/charcoal tokens.

## Motion Rules
- MOTION_INTENSITY <= 3: no auto-animations, only hover/active.
- MOTION_INTENSITY 4-7: subtle transforms and opacity with eased transitions.
- MOTION_INTENSITY 8-10: advanced choreography is allowed, but only in isolated leaf components with cleanup.
- Never implement scroll-driven UI with window scroll listeners. Use IntersectionObserver or an animation library that owns scroll (and clean up).
- Always honor prefers-reduced-motion for non-trivial motion.

## Interaction States (Always Implement)
- Loading: skeletons that match final layout.
- Empty: composed empty states with a clear next action.
- Error: clear inline errors; avoid toast-only errors for forms.
- Tactile: active state uses a tiny translate/scale for physical feedback.

## Pre-Flight Checklist
- Hero fits viewport: CTA visible, no headline wrap explosion.
- Contrast: buttons and inputs pass WCAG AA contrast.
- Consistency: one accent, one radius system, one neutral temperature.
- Layout: no repeated section layout pattern for every section.
- Copy: no filler buzzwords, no generic "Acme/John Doe" content.
