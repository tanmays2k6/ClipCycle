"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ArrowUpDown,
  FolderOpen,
  Plus,
  Wand2,
  CheckCircle2,
  Clock,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import type { Idea } from "@/types/database";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/utils/cn";

export default function IdeasClient({ initialIdeas }: { initialIdeas: Idea[] }) {
  const [ideas, _setIdeas] = useState<Idea[]>(initialIdeas);
  const [_isSearchFocused, setIsSearchFocused] = useState(false);

  // Derived Stats
  const totalIdeas = ideas.length;
  const pendingIdeas = ideas.filter(i => i.status === "pending").length;
  const publishedIdeas = ideas.filter(i => i.status === "used").length;
  // Mock AI Ready logic for KPI: items not yet published that have enough content
  const aiReadyIdeas = ideas.filter(i => i.status !== "used" && i.description && i.description.length > 20).length;

  return (
    <div className="max-w-[1600px] mx-auto w-full flex flex-col min-h-full pb-16">
      
      {/* 1. Breadcrumb */}
      <div className="pt-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs font-medium text-text-tertiary">
          <span>Workspace</span>
          <span>/</span>
          <span className="text-text-secondary">Idea Vault</span>
        </div>
      </div>

      {/* 2. Page Header */}
      <header className="px-4 sm:px-6 lg:px-8 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Idea Vault</h1>
          <p className="text-sm text-text-tertiary mt-1">Manage, organize and repurpose your ideas.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard/generate" className="btn-secondary py-2">
            <Wand2 className="w-4 h-4" />
            AI Actions
          </Link>
          <Link href="/dashboard/ideas/new" className="btn-primary glow py-2">
            <Plus className="w-4 h-4" />
            New Idea
          </Link>
        </div>
      </header>

      {/* 3. Statistics Row */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Ideas", value: totalIdeas, icon: Lightbulb, color: "text-brand-primary", bg: "bg-brand-primary/10" },
            { label: "Pending", value: pendingIdeas, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
            { label: "AI Ready", value: aiReadyIdeas, icon: Sparkles, color: "text-violet-400", bg: "bg-violet-400/10" },
            { label: "Published", value: publishedIdeas, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          ].map((stat, i) => (
            <div key={i} className="h-[90px] rounded-2xl bg-surface border border-border p-4 flex flex-col justify-center relative overflow-hidden group">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary leading-none">{stat.value}</h3>
                  <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Toolbar (Sticky) */}
      <div className="sticky top-0 z-30 mt-6 bg-background/80 backdrop-blur-xl border-y border-border/50 py-3 shadow-sm transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full md:max-w-[600px] group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              placeholder="Search ideas, tags or keywords..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full h-12 pl-10 pr-12 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all shadow-sm"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-background border border-border text-text-tertiary">
                Ctrl + K
              </kbd>
            </div>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide shrink-0 justify-end">
            <button className="flex items-center gap-2 h-10 px-3 rounded-xl bg-surface border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors whitespace-nowrap shadow-sm">
              <Filter className="w-4 h-4 shrink-0" />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-2 h-10 px-3 rounded-xl bg-surface border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors whitespace-nowrap shadow-sm">
              <ArrowUpDown className="w-4 h-4 shrink-0" />
              <span>Sort</span>
            </button>
            <button className="flex items-center gap-2 h-10 px-3 rounded-xl bg-surface border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors whitespace-nowrap shadow-sm">
              <FolderOpen className="w-4 h-4 shrink-0" />
              <span>Collections</span>
            </button>
          </div>

        </div>
      </div>

      {/* 5. Idea Grid */}
      <div className="px-4 sm:px-6 lg:px-8 mt-8 flex-1">
        {ideas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea, i) => (
              <IdeaCard key={idea.id} idea={idea} index={i} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg mx-auto flex flex-col items-center justify-center text-center py-24"
          >
            <div className="w-24 h-24 rounded-3xl bg-brand-primary/10 flex items-center justify-center mb-6 shadow-premium glass-premium card-hover-border relative overflow-hidden">
               <div className="absolute inset-0 bg-brand-gradient opacity-10 mix-blend-overlay" />
               <FolderOpen className="w-10 h-10 text-brand-primary relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary tracking-tight mb-2">Your vault is empty</h3>
            <p className="text-sm text-text-secondary mb-8 leading-relaxed max-w-sm mx-auto">
              You haven't captured any ideas yet. Start building your content library by adding a new idea manually or connecting a source.
            </p>
            <Link href="/dashboard/ideas/new" className="btn-primary glow px-6 py-3">
              <Plus className="w-4 h-4 shrink-0" />
              Create your first idea
            </Link>
          </motion.div>
        )}
      </div>

    </div>
  );
}
