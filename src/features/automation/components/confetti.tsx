import { motion } from "framer-motion";
import React from "react";

// Confetti component with emerald particles only
export const Confetti = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {[...Array(40)].map((_, i) => {
        return (
          <motion.div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              backgroundColor: [
                "var(--primary)",
                "var(--secondary)",
                "var(--accent)",
                "var(--chart-1)",
              ][Math.floor(Math.random() * 4)],
              left: `${Math.random() * 100}%`,
              top: -20,
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [1, 1, 0],
              rotate: Math.random() * 720 - 360,
              x: Math.random() * 200 - 100,
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        );
      })}
    </div>
  );
};
