"use client";

import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

import { useParticles } from "@/hooks/client";

export const FloatingSymbol = ({
  children,
  elementNo = 6,
}: {
  children: React.ReactNode;
  elementNo?: number;
}) => {
  const { particles } = useParticles(elementNo);

  return particles.map((element) => (
    <motion.div
      key={uuidv4()}
      className="absolute"
      style={{
        left: element.left,
        top: element.top,
      }}
      animate={{
        y: [0, -15, 0],
        rotate: [0, 5, -5, 0],
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{
        duration: element.duration,
        repeat: Number.POSITIVE_INFINITY,
        delay: element.delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  ));
};
