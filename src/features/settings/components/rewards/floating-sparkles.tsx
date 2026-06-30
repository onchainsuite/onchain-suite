import { SparklesIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import React from "react";

const FloatingSparkles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => {
        return (
          <motion.div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className="absolute"
            initial={{
              opacity: 0,
              x: Math.random() * 400 - 200,
              y: Math.random() * 200 - 100,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -100],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
            style={{
              left: "50%",
              top: "50%",
            }}
          >
            <SparklesIcon
              className="h-4 w-4 text-primary"
              style={{ opacity: 0.5 }}
              aria-hidden="true"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingSparkles;
