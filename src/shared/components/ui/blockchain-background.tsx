"use client";

import { type Engine, type ISourceOptions } from "@tsparticles/engine";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "next-themes";
import { type ReactNode } from "react";

const particlesInit = async (engine: Engine) => {
  await loadSlim(engine);
};

export const BlockchainBackground = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const particlesOptions: ISourceOptions = {
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        onClick: {
          enable: true,
          mode: "push",
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 1,
          },
        },
        push: {
          quantity: 4,
        },
      },
    },
    particles: {
      color: {
        value: isDark ? "#F0F7FF" : "#1727E0",
      },
      links: {
        color: isDark ? "#F0F7FF" : "#1727E0",
        distance: 150,
        enable: true,
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        outModes: {
          default: "out",
        },
      },
      number: {
        // v2 `density.area: 800` ≈ an 800k px² reference box in v4
        density: {
          enable: true,
          width: 1000,
          height: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  return (
    <div className="min-h-screen w-full relative bg-background">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%,
              oklch(from var(--accent) l c h / 0.25) 0%,
              transparent 70%
            ),
            radial-gradient(ellipse 80% 60% at 50% 100%,
              oklch(from var(--accent) l c h / 0.25) 0%,
              transparent 70%
            ),
            var(--background)
          `
            .replace(/\s+/g, " ")
            .trim(),
        }}
      />
      <ParticlesProvider init={particlesInit}>
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />
      </ParticlesProvider>

      {children}
    </div>
  );
};
