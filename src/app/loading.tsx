"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
          filter: [
            "drop-shadow(0 0 10px rgba(168, 85, 247, 0))", 
            "drop-shadow(0 0 30px rgba(168, 85, 247, 0.6))", 
            "drop-shadow(0 0 10px rgba(168, 85, 247, 0))"
          ]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Logo size={64} />
      </motion.div>
    </div>
  );
}
