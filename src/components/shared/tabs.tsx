"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export interface Tab {
  key: string;
  label: string;
  icon: React.ElementType;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  layoutId?: string;
}

export function TabBar({ tabs, activeTab, onTabChange, layoutId = "tab-indicator" }: TabBarProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-surface/60 border border-border w-full overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 whitespace-nowrap flex-1 min-w-0",
              isActive
                ? "text-text-primary"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl bg-surface-hover border border-border-hover"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <tab.icon className={cn("w-4 h-4 relative z-10 shrink-0", isActive && "text-violet-400")} />
            <span className="relative z-10 hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps {
  active: boolean;
  children: React.ReactNode;
}

export function TabPanel({ active, children }: TabPanelProps) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
