"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  LayoutDashboard,
  Lightbulb,
  Search,
  Wand2,
  Settings,
  LogOut,
  ChevronLeft,
  Calendar,
  BarChart,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Logo } from "@/components/ui/logo";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Ideas", href: "/dashboard/ideas", icon: Lightbulb },
      { label: "Search", href: "/dashboard/search", icon: Search },
      { label: "AI Generator", href: "/dashboard/generate", icon: Wand2 },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

export function Sidebar({ collapsed, onToggle, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { userDisplayName, userInitials, userAvatarUrl, userEmail } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  // Mock storage for premium aesthetic
  const storageUsed = 45; // 45%

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
      className={cn(
        "flex flex-col h-screen sticky top-0 border-r border-border bg-background z-40 overflow-hidden",
        !isMobile && "hidden lg:flex"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-[64px] shrink-0 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center min-w-0 h-full gap-3">
          <Logo variant="icon" size={collapsed ? 28 : 32} />
          {!collapsed && (
            <span className="font-bold text-xl tracking-tight text-text-primary">
              ClipCycle
            </span>
          )}
        </Link>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-6 scrollbar-hide">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-3 pb-2 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider"
              >
                {group.label}
              </motion.div>
            )}
            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <motion.div key={item.href} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={item.href}
                    prefetch={["/dashboard", "/dashboard/generate", "/dashboard/ideas"].includes(item.href) ? true : false}
                    className={cn(
                    "relative flex items-center gap-3 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 group overflow-hidden",
                    isActive
                      ? "text-text-primary bg-surface-hover/50"
                      : "text-text-tertiary hover:text-text-secondary hover:bg-surface/50"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-surface-hover border border-border/50"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  <item.icon
                    className={cn(
                      "w-4 h-4 shrink-0 relative z-10 transition-colors",
                      isActive ? "text-text-primary" : "text-text-tertiary group-hover:text-text-secondary"
                    )}
                  />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative z-10 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg bg-surface-hover border border-border text-xs text-text-primary whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-50">
                      {item.label}
                    </div>
                  )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border/50 shrink-0 bg-background/50 backdrop-blur-md">
        
        {!collapsed && (
          <div className="mb-4">
            {/* Storage widget removed per user request */}
          </div>
        )}

        {/* User Card */}
        <div className={cn(
          "flex items-center gap-2 p-1.5 rounded-lg transition-colors",
          !collapsed && "hover:bg-surface cursor-pointer group relative"
        )}>
          {userAvatarUrl ? (
            <Image
              src={userAvatarUrl}
              alt={userDisplayName}
              width={32}
              height={32}
              loading="lazy"
              fetchPriority="low"
              className="w-8 h-8 rounded-full shrink-0 object-cover border border-border/50 shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white shrink-0 shadow-sm">
              <Logo variant="icon" size={18} />
            </div>
          )}
          
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-w-0 flex-1"
            >
              <div className="flex items-center justify-between">
                <p className="text-body font-semibold truncate">
                  {userDisplayName}
                </p>
              </div>
              <p className="text-caption truncate">
                Pro Plan
              </p>
            </motion.div>
          )}

          {!collapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSignOut();
              }}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-text-tertiary opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-400/10 transition-all absolute right-2"
              aria-label="Log Out"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {collapsed && (
             <button
              onClick={handleSignOut}
              className="absolute left-full ml-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-surface-hover border border-border text-red-400 opacity-0 pointer-events-none hover:bg-surface transition-opacity shadow-xl z-50 group-hover:opacity-100"
              aria-label="Log Out"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
