"use client";

import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

import { useParticles } from "@/hooks/client";

export const FloatingParticle = ({
  particleNo = 6,
}: {
  particleNo?: number;
}) => {
  const { particles } = useParticles(particleNo);

  return particles.map((particle) => (
    <motion.div
      key={uuidv4()}
      className="bg-primary/30 absolute h-2 w-2 rounded-full"
      style={{
        left: particle.left,
        top: particle.top,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 1, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: particle.duration,
        repeat: Number.POSITIVE_INFINITY,
        delay: particle.delay,
        ease: "easeInOut",
      }}
    />
  ));
};
