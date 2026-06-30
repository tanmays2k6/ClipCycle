"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
            filter: [
              "drop-shadow(0 0 10px rgba(37, 99, 235, 0))", 
              "drop-shadow(0 0 30px rgba(37, 99, 235, 0.6))", 
              "drop-shadow(0 0 10px rgba(37, 99, 235, 0))"
            ]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Logo variant="icon" size={80} />
        </motion.div>
        <p className="text-muted-foreground font-medium text-[15px] animate-pulse">
          Loading your Idea Vault...
        </p>
      </div>
    </div>
  );
}
