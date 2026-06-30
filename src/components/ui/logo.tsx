"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export interface LogoProps {
  size?: number;
  variant?: "horizontal" | "icon";
  className?: string;
  animated?: boolean;
}

export function Logo({
  size = 40,
  variant = "icon",
  className,
  animated = false,
}: LogoProps) {
  const imgSrc = variant === "horizontal" 
    ? "https://i.postimg.cc/d3VW6qP0/Chat-GPT-Image-Jun-30-2026-10-03-16-PM.png" 
    : "https://i.postimg.cc/T1BrbGT4/Chat-GPT-Image-Jun-30-2026-10-15-15-PM.png";

  const content = (
    <div
      className={cn(
        "relative flex items-center justify-start",
        className
      )}
      style={{ height: `${size}px` }}
    >
      <img
        src={imgSrc}
        alt="ClipCycle Logo"
        className="w-auto h-full object-contain pointer-events-none select-none dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all"
      />
    </div>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ rotate: variant === "icon" ? 5 : 1, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="inline-flex items-center cursor-pointer"
      >
        {content}
      </motion.div>
    );
  }

  return <div className="inline-flex items-center">{content}</div>;
}
