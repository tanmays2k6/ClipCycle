"use client";

import { motion } from "framer-motion";

const pageTransitionConfig = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
} as const;

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={pageTransitionConfig}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
