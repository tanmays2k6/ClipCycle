"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  Search,
  Filter,
  FileText,
  Link2,
  Camera,
  Mic,
  ImageIcon,
  Bookmark,
  Play,
  Briefcase,
  MessageCircle,
  MessageSquare,
  Loader2,
  BrainCircuit,
  Terminal,
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { Idea, IdeaStatus, IdeaPlatform } from "@/types/database";

// ── Icons & Config ───────────────────────────────────────────────────────────

const sourceIcons: Record<string, React.ElementType> = {
  text: FileText,
  link: Link2,
  screenshot: Camera,
  voice: Mic,
  "instagram-save": ImageIcon,
  bookmark: Bookmark,
};

const platformIcons: Record<string, React.ElementType> = {
  instagram: ImageIcon,
  youtube: Play,
  linkedin: Briefcase,
  twitter: MessageCircle,
  blog: FileText,
};

const platformColors: Record<string, string> = {
  instagram: "text-pink-400",
  youtube: "text-red-400",
  linkedin: "text-blue-400",
  twitter: "text-cyan-400",
  blog: "text-emerald-400",
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-400/10" },
  draft: { label: "Draft", color: "text-blue-400", bg: "bg-blue-400/10" },
  used: { label: "Used", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  archived: { label: "Archived", color: "text-text-tertiary", bg: "bg-surface-hover" },
};

const filterStatuses: { value: IdeaStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "draft", label: "Draft" },
  { value: "used", label: "Used" },
  { value: "archived", label: "Archived" },
];

const filterPlatforms: { value: IdeaPlatform | "all"; label: string }[] = [
  { value: "all", label: "All Platforms" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter" },
  { value: "blog", label: "Blog" },
];

// ── Components ───────────────────────────────────────────────────────────────

function SearchResultRow({ idea, index }: { idea: Idea; index: number }) {
  const SourceIcon = sourceIcons[idea.source] ?? FileText;
  const status = statusConfig[idea.status];

  // Format date safely
  const formattedDate = format(parseISO(idea.created_at), "MMM d, yyyy");

  return (
    <Link href={`/dashboard/ideas/${idea.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
        className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-surface/50 border border-border hover:border-border-hover hover:bg-surface transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center shrink-0">
            <SourceIcon className="w-5 h-5 text-text-tertiary" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h3 className="text-sm font-semibold text-text-primary truncate">
              {idea.title}
            </h3>
            <p className="text-xs text-text-tertiary mt-0.5 truncate">
              {idea.source_label || "Manual Entry"} · {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 pl-14 sm:pl-0">
          {/* Tags */}
          <div className="hidden md:flex items-center gap-1.5 flex-wrap w-32">
            {idea.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-text-tertiary bg-surface-hover px-2 py-0.5 rounded-md truncate max-w-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Platforms */}
          <div className="hidden sm:flex items-center gap-1.5 w-16">
            {idea.platforms?.slice(0, 3).map((p) => {
              const PIcon = platformIcons[p] ?? MessageSquare;
              return <PIcon key={p} className={cn("w-3.5 h-3.5", platformColors[p])} />;
            })}
          </div>

          {/* Status */}
          <span
            className={cn(
              "text-[11px] font-medium px-2 py-0.5 rounded-md shrink-0 w-16 text-center",
              status.color,
              status.bg
            )}
          >
            {status.label}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [status, setStatus] = useState<IdeaStatus | "all">("all");
  const [platform, setPlatform] = useState<IdeaPlatform | "all">("all");
  
  const [results, setResults] = useState<Idea[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [strategy, setStrategy] = useState<"keyword" | "semantic">("keyword");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Perform search
  const fetchResults = useCallback(async () => {
    // If empty query and no filters, don't show results yet unless they hit enter
    if (!debouncedQuery.trim() && status === "all" && platform === "all" && !hasSearched) {
      setResults([]);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (debouncedQuery.trim()) params.append("q", debouncedQuery.trim());
      if (status !== "all") params.append("status", status);
      if (platform !== "all") params.append("platform", platform);
      params.append("limit", "50");

      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.ideas || []);
        setTotal(data.total || 0);
        setStrategy(data.strategy || "keyword");
      }
    } catch (err) {
      // Silent fail in production
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, status, platform, hasSearched]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResults();
  }, [fetchResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setDebouncedQuery(query);
      setHasSearched(true);
    }
  };

  const isInitialState = !hasSearched && !query.trim() && status === "all" && platform === "all";

  return (
    <div className="max-w-5xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header Area - Animates from center to top */}
      <motion.div
        layout
        initial={false}
        animate={{
          flex: isInitialState ? 1 : 0,
          justifyContent: isInitialState ? "center" : "flex-start",
          paddingTop: isInitialState ? "10vh" : "0",
          paddingBottom: isInitialState ? "10vh" : "1.5rem"
        }}
        className="flex flex-col w-full"
      >
        <motion.div layout className="text-center sm:text-left mb-6 sm:mb-8">
          <motion.div layout className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center">
              <Search className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="text-3xl font-bold text-text-primary tracking-tight">
              Global Search
            </h2>
          </motion.div>
          <motion.p layout className="text-sm text-text-secondary pl-0 sm:pl-13">
            Find ideas by title, description, or meaning.
          </motion.p>
        </motion.div>

        <motion.div layout className="w-full max-w-3xl mx-auto sm:mx-0 space-y-4">
          {/* Main Search Bar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div whileHover={{ scale: 1.005 }} className="relative flex items-center bg-surface border border-border focus-within:border-violet-500/50 focus-within:ring-4 focus-within:ring-violet-500/10 focus-within:scale-[1.01] rounded-2xl px-4 py-3.5 transition-all duration-300">
              <Search className="w-5 h-5 text-text-tertiary shrink-0 mr-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search ideas, topics, or keywords..."
                className="bg-transparent text-base text-text-primary placeholder:text-text-tertiary outline-none w-full"
                autoFocus
              />
              {isLoading && (
                <Loader2 className="w-5 h-5 text-violet-400 animate-spin shrink-0 ml-3" />
              )}
            </motion.div>
          </div>

          {/* Filters Bar */}
          <motion.div layout className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-text-tertiary bg-surface-hover px-3 py-1.5 rounded-lg border border-border">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </div>
            
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IdeaStatus | "all")}
              className="bg-surface border border-border text-text-secondary text-sm rounded-lg px-3 py-1.5 outline-none focus:border-violet-500/50 appearance-none cursor-pointer hover:bg-surface-hover transition-colors"
            >
              {filterStatuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as IdeaPlatform | "all")}
              className="bg-surface border border-border text-text-secondary text-sm rounded-lg px-3 py-1.5 outline-none focus:border-violet-500/50 appearance-none cursor-pointer hover:bg-surface-hover transition-colors"
            >
              {filterPlatforms.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Results Area */}
      <AnimatePresence mode="wait">
        {!isInitialState && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex-1 flex flex-col"
          >
            {/* Meta bar */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
              <span className="text-sm font-medium text-text-secondary">
                {total} result{total !== 1 ? 's' : ''} found
              </span>
              
              {/* Strategy Indicator Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-hover border border-border/50 text-[11px] font-medium text-text-tertiary">
                {strategy === "keyword" ? (
                  <>
                    <Terminal className="w-3 h-3 text-emerald-400" />
                    Keyword Match
                    <span className="ml-1 opacity-50">(Semantic coming soon)</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-3 h-3 text-violet-400" />
                    AI Semantic Match
                  </>
                )}
              </div>
            </div>

            {/* List */}
            {results.length > 0 ? (
              <div className="space-y-2 pb-12">
                {results.map((idea, i) => (
                  <SearchResultRow key={idea.id} idea={idea} index={i} />
                ))}
              </div>
            ) : !isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-24 px-4">
                <div className="w-20 h-20 rounded-3xl bg-brand-primary/10 flex items-center justify-center mb-6 shadow-premium glass-premium card-hover-border relative overflow-hidden">
                   <div className="absolute inset-0 bg-brand-gradient opacity-10 mix-blend-overlay" />
                   <Search className="w-8 h-8 text-brand-primary relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-text-primary tracking-tight mb-2">
                  No matches found
                </h3>
                <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto leading-relaxed">
                  We couldn&apos;t find anything matching your search. Try adjusting your keywords or filters.
                </p>
                <button 
                  onClick={() => setQuery("")} 
                  className="btn-secondary px-6"
                >
                  Clear search
                </button>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
