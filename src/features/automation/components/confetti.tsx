import React from "react";
import { motion } from "framer-motion";

// Confetti component with emerald particles only
export const Confetti = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            backgroundColor: [
              "#059669", // emerald-600
              "#10b981", // emerald-500
              "#34d399", // emerald-400
              "#6ee7b7", // emerald-300
            ][Math.floor(Math.random() * 5)],
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
      ))}
    </div>
  );
};
