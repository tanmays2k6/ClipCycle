"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  FileText,
  Link2,
  Camera,
  Mic,
  Bookmark,
  ImageIcon,
  Play,
  Briefcase,
  MessageCircle,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Edit2,
  Trash2,
  Wand2,
  Star,
  ExternalLink
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { Idea } from "@/types/database";

/* ─────────────── Configuration ─────────────── */

const platformIcons: Record<string, React.ElementType> = {
  instagram: ImageIcon,
  youtube: Play,
  linkedin: Briefcase,
  twitter: MessageCircle,
  blog: FileText,
};

const platformColors: Record<string, string> = {
  instagram: "text-pink-400 bg-pink-400/10",
  youtube: "text-red-400 bg-red-400/10",
  linkedin: "text-blue-400 bg-blue-400/10",
  twitter: "text-cyan-400 bg-cyan-400/10",
  blog: "text-emerald-400 bg-emerald-400/10",
};

const sourceIcons: Record<string, React.ElementType> = {
  text: FileText,
  link: Link2,
  screenshot: Camera,
  voice: Mic,
  "instagram-save": ImageIcon,
  bookmark: Bookmark,
};

// Draft: Gray, Pending: Amber, Published: Green, Archived: Slate
const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/20" },
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-500/20" },
  used: { label: "Published", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-500/20" },
  archived: { label: "Archived", color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" },
};

/* ─────────────── Component ─────────────── */

export const IdeaCard = React.memo(function IdeaCard({ idea, index }: { idea: Idea; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const SourceIcon = sourceIcons[idea.source] ?? FileText;
  // Map legacy statuses if any
  const statusKey = idea.status === "used" ? "used" : (statusConfig[idea.status] ? idea.status : "draft");
  const status = statusConfig[statusKey];

  const formattedDate = format(parseISO(idea.created_at), "MMM d, yyyy");

  // Deterministic AI Scores for visual effect as requested
  const aiScore = 75 + ((idea.id.charCodeAt(0) * 7) % 24);
  const isTrending = aiScore > 90;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ 
        opacity: { duration: 0.4, delay: 0.05 + (index % 10) * 0.05 },
        default: { type: "spring", stiffness: 400, damping: 30 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-6 rounded-[24px] glass-premium hover-lift card-hover-border flex flex-col h-[280px] overflow-hidden shrink-0"
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top Header: Source, Date, Status */}
      <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 shadow-sm">
            <SourceIcon className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-text-secondary truncate">
              {idea.source_label || "Manual Entry"}
            </p>
            <p className="text-[11px] text-text-tertiary font-medium mt-0.5">
              {formattedDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              "text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-md border",
              status.color,
              status.bg
            )}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="mb-6 relative z-10 flex-grow">
        <h3 className="text-xl font-bold text-text-primary tracking-tight leading-snug mb-2 line-clamp-2">
          {idea.title}
        </h3>
        <p className="text-sm text-text-tertiary leading-relaxed line-clamp-3">
          {idea.description || "No description provided."}
        </p>
      </div>

      {/* AI Readiness & Meta */}
      <div className="mt-auto space-y-4 relative z-10">
        
        {/* AI Score Bar */}
        <div className="bg-surface/50 border border-border/50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              AI Readiness
            </div>
            <div className="flex items-center gap-2">
              {isTrending && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded uppercase">
                  <TrendingUp className="w-3 h-3" /> Hot
                </span>
              )}
              <span className="text-xs font-bold text-brand-primary">{aiScore}%</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-gradient rounded-full"
              style={{ width: `${aiScore}%` }}
            />
          </div>
        </div>

        {/* Tags & Platforms */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {idea.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-text-secondary bg-surface border border-border px-2 py-1 rounded-lg truncate max-w-[100px]"
              >
                #{tag}
              </span>
            ))}
            {(idea.tags?.length || 0) > 2 && (
              <span className="text-[11px] font-medium text-text-tertiary bg-surface border border-border px-2 py-1 rounded-lg">
                +{(idea.tags?.length || 0) - 2}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {idea.platforms?.map((platform) => {
              const PlatformIcon = platformIcons[platform] ?? MessageSquare;
              return (
                <div key={platform} className={cn("p-1.5 rounded-lg", platformColors[platform])}>
                  <PlatformIcon className="w-3.5 h-3.5" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Hover Actions */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 rounded-2xl bg-surface/90 backdrop-blur-xl border border-border shadow-premium z-20"
          >
            <Link href={`/dashboard/ideas/${idea.id}`} aria-label="View Idea" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors tooltip-trigger">
              <ExternalLink className="w-4 h-4" />
            </Link>
            <motion.button aria-label="Generate AI Content" whileTap={{ scale: 0.92 }} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-primary/10 transition-colors">
              <Wand2 className="w-4 h-4" />
            </motion.button>
            <div className="w-px h-4 bg-border mx-1" />
            <motion.button aria-label="Edit Idea" whileTap={{ scale: 0.92 }} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors">
              <Edit2 className="w-4 h-4" />
            </motion.button>
            <motion.button aria-label="Star Idea" whileTap={{ scale: 0.92 }} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-text-secondary hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors">
              <Star className="w-4 h-4" />
            </motion.button>
            <motion.button aria-label="Delete Idea" whileTap={{ scale: 0.92 }} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition-colors">
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
