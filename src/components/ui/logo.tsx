"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export interface LogoProps {
  size?: number;
  variant?: "full" | "icon";
  className?: string;
  animated?: boolean;
}

export function Logo({
  size = 40,
  variant = "icon",
  className,
  animated = false,
}: LogoProps) {
  // We use object-contain to ensure the logo is never cropped.
  // The container relies on height, and width adjusts automatically.
  // We apply mix-blend-screen so the black background blends seamlessly into the dark theme.
  
  const imgSrc = variant === "full" ? "/images/logo.jpg" : "/images/icon.png";

  const content = (
    <div
      className={cn(
        "relative flex items-center justify-start mix-blend-screen",
        className
      )}
      style={{ height: `${size}px`, minWidth: `${size}px` }}
    >
      <Image
        src={imgSrc}
        alt="ClipCycle Logo"
        width={0}
        height={0}
        sizes="100vw"
        priority
        className="w-auto h-full object-contain pointer-events-none select-none"
      />
    </div>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ rotate: 5, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="inline-flex items-center cursor-pointer"
      >
        {content}
      </motion.div>
    );
  }

  return <div className="inline-flex items-center">{content}</div>;
}
