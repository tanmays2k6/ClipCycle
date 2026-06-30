"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { usePreferences } from "@/store/usePreferences";
import { cn } from "@/utils/cn";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const { setTheme: setPrefTheme } = usePreferences();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return <div className="w-[80px] h-[44px] rounded-full bg-surface border border-border" />;
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleSelect = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setPrefTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-between w-[80px] h-[44px] rounded-full bg-card border border-border p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm group"
        aria-label="Toggle theme"
      >
        {/* Animated slider background */}
        <motion.div
          className="absolute w-[34px] h-[34px] rounded-full bg-muted border border-border/50 shadow-sm pointer-events-none"
          initial={false}
          animate={{ x: isDark ? 36 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />

        <div className="relative z-10 flex items-center justify-center w-[34px] h-[34px]">
          <Sun className={cn("w-4 h-4 transition-colors", !isDark ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
        </div>
        <div className="relative z-10 flex items-center justify-center w-[34px] h-[34px]">
          <Moon className={cn("w-4 h-4 transition-colors", isDark ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-[calc(100%+8px)] right-0 w-36 rounded-xl bg-card border border-border shadow-xl p-1 z-50 overflow-hidden"
          >
            <div className="flex flex-col">
              <button
                onClick={() => handleSelect("light")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors",
                  theme === "light" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Sun className="w-4 h-4" /> Light
              </button>
              <button
                onClick={() => handleSelect("dark")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors",
                  theme === "dark" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Moon className="w-4 h-4" /> Dark
              </button>
              <button
                onClick={() => handleSelect("system")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors",
                  theme === "system" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Monitor className="w-4 h-4" /> System
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
