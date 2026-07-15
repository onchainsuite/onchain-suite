/**
 * Lightweight framer-motion stand-in for component tests.
 *
 * Renders `motion.*` elements as their plain DOM tag (stripping animation
 * props so React doesn't warn about unknown attributes) and makes
 * `AnimatePresence` a passthrough so exit animations don't delay unmounts.
 *
 * Usage in a test file:
 *   vi.mock("framer-motion", () => import("@/test/mocks/framer-motion"));
 */
import type { ElementType, ReactNode } from "react";
import { createElement, forwardRef } from "react";

const MOTION_ONLY_PROPS = new Set([
  "initial",
  "animate",
  "exit",
  "transition",
  "variants",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "viewport",
  "layout",
  "layoutId",
  "drag",
  "dragConstraints",
  "dragElastic",
  "onAnimationStart",
  "onAnimationComplete",
]);

const createMotionComponent = (tag: string) => {
  const Component = forwardRef<Element, Record<string, unknown>>(
    (props, ref) => {
      const domProps: Record<string, unknown> = { ref };
      for (const [key, value] of Object.entries(props)) {
        if (!MOTION_ONLY_PROPS.has(key)) domProps[key] = value;
      }
      return createElement(tag as ElementType, domProps);
    }
  );
  Component.displayName = `motion.${tag}`;
  return Component;
};

const componentCache = new Map<
  string,
  ReturnType<typeof createMotionComponent>
>();

export const motion = new Proxy({} as Record<string, unknown>, {
  get: (_target, prop) => {
    const tag = String(prop);
    if (!componentCache.has(tag)) {
      componentCache.set(tag, createMotionComponent(tag));
    }
    return componentCache.get(tag);
  },
});

export const AnimatePresence = ({ children }: { children?: ReactNode }) => (
  <>{children}</>
);
