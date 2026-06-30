"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  Menu,
  X,
  Bell,
  Plus,
  Wand2,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/utils/cn";

interface TopbarProps {
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export function Topbar({ mobileMenuOpen, onToggleMobileMenu }: TopbarProps) {
  const pathname = usePathname();
  const { userDisplayName, userInitials, userAvatarUrl } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const firstName = userDisplayName?.split(" ")[0] || "Creator";

  // Determine context
  const isDashboard = pathname === "/dashboard";
  const title = isDashboard ? `Good Morning, ${firstName} 👋` : "Idea Vault";
  const subtitle = isDashboard 
    ? "You have 2 ideas waiting to become content."
    : "Manage, filter, and repurpose your captured inspiration.";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/60 backdrop-blur-3xl">
        <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-8 py-4 flex items-center justify-between">
          
          {/* Left: Mobile menu + Context Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            
            <div className="flex flex-col">
              {!isDashboard && (
                <>
                  <h1 className="text-h2">
                    {title}
                  </h1>
                  <p className="text-caption mt-0.5">
                    {subtitle}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right: Actions + Notifications + Avatar */}
          <div className="flex items-center gap-4">
            
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-3 mr-2">
              {!isDashboard && (
                <>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/dashboard/ideas/new"
                      className="btn-secondary py-2 px-3 text-[13px]"
                    >
                      <Plus className="w-4 h-4" />
                      Quick Capture
                    </Link>
                  </motion.div>
                  
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/dashboard/generate"
                      className="btn-primary glow py-2 px-3 text-[13px]"
                    >
                      <Wand2 className="w-4 h-4" />
                      AI Generator
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            <div className="w-px h-6 bg-border hidden sm:block mx-1" />

            {/* Notifications */}
            <div className="relative">
              <motion.button 
                whileTap={{ scale: 0.9 }} 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-violet-500 shadow-glow border border-background" />
              </motion.button>
              
              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 rounded-2xl bg-surface border border-border shadow-premium z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-border/50">
                        <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
                      </div>
                      <div className="p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h4 className="text-base font-semibold text-text-primary mb-1">You're all caught up!</h4>
                        <p className="text-xs text-text-tertiary">No new notifications right now.</p>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <div className="pl-1 hidden sm:block">
              {userAvatarUrl ? (
                <Image
                  src={userAvatarUrl}
                  alt={userDisplayName}
                  width={32}
                  height={32}
                  loading="lazy"
                  fetchPriority="low"
                  className="w-8 h-8 rounded-full object-cover cursor-pointer border border-border/50 shadow-sm transition-transform hover:scale-105 hover-lift"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white cursor-pointer shadow-sm transition-transform hover:scale-105 hover-lift">
                  {userInitials}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
