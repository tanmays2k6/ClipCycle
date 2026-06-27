"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Wand2,
  Sparkles,
  ImageIcon,
  Briefcase,
  MessageCircle,
  Mail,
  LayoutGrid,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/utils/cn";

// ── Tab definitions ──────────────────────────────────────────────────────────

type TabKey =
  | "instagram_caption"
  | "linkedin_post"
  | "twitter_thread"
  | "newsletter"
  | "carousel";

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
}

const tabs: Tab[] = [
  {
    key: "instagram_caption",
    label: "Instagram",
    icon: ImageIcon,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    description: "Caption with hooks, hashtags & CTA",
  },
  {
    key: "linkedin_post",
    label: "LinkedIn",
    icon: Briefcase,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    description: "Professional post with insights",
  },
  {
    key: "twitter_thread",
    label: "Twitter",
    icon: MessageCircle,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    description: "Threaded tweets for engagement",
  },
  {
    key: "newsletter",
    label: "Newsletter",
    icon: Mail,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    description: "Email-ready newsletter section",
  },
  {
    key: "carousel",
    label: "Carousel",
    icon: LayoutGrid,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    description: "Slide-by-slide carousel script",
  },
];

// ── Component ────────────────────────────────────────────────────────────────

type ContentMap = Record<TabKey, string>;

const emptyContent: ContentMap = {
  instagram_caption: "",
  linkedin_post: "",
  twitter_thread: "",
  newsletter: "",
  carousel: "",
};

const PROGRESS_STEPS = [
  "Analyzing topic...",
  "Finding keywords...",
  "Understanding audience...",
  "Generating hook...",
  "Writing final content..."
];

export default function GeneratePage() {
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("instagram_caption");
  const [content, setContent] = useState<ContentMap>(emptyContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(12);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cacheRef = useRef<Record<string, ContentMap>>({});

  const currentTab = tabs.find((t) => t.key === activeTab)!;
  const currentContent = content[activeTab];
  const canGenerate =
    ideaTitle.trim().length > 0 && ideaDescription.trim().length > 0;

  // ── Generate ───────────────────────────────────────────────────────────────

  const handleGenerate = async (forceRegenerate = false) => {
    if (!canGenerate || isGenerating || isSuccess) return;

    const cacheKey = `${ideaTitle.trim()}-${ideaDescription.trim()}`;
    
    if (!forceRegenerate && cacheRef.current[cacheKey]) {
      setContent(cacheRef.current[cacheKey]);
      setHasGenerated(true);
      toast.success("Loaded from cache!");
      return;
    }

    setIsGenerating(true);
    setIsSuccess(false);
    setError(null);
    setProgressStep(0);
    setProgressPercent(0);
    setTimeRemaining(12);
    setHasGenerated(false);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const percent = Math.min((elapsed / 12) * 100, 99);
      setProgressPercent(percent);
      setTimeRemaining(Math.max(12 - elapsed, 1));
      setProgressStep(Math.min(Math.floor((percent / 100) * PROGRESS_STEPS.length), PROGRESS_STEPS.length - 1));
    }, 100);

    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: ideaTitle.trim(),
          description: ideaDescription.trim(),
        }),
      });

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setIsGenerating(false);
        return;
      }

      const newContent = {
        instagram_caption: data.content.instagram_caption ?? "",
        linkedin_post: data.content.linkedin_post ?? "",
        twitter_thread: data.content.twitter_thread ?? "",
        newsletter: data.content.newsletter ?? "",
        carousel: data.content.carousel ?? "",
      };

      cacheRef.current[cacheKey] = newContent;
      setContent(newContent);
      
      setProgressPercent(100);
      setProgressStep(PROGRESS_STEPS.length - 1);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setIsGenerating(false);
        setHasGenerated(true);
      }, 1500);

    } catch {
      clearInterval(interval);
      setError("Network error. Please try again.");
      setIsGenerating(false);
    }
  };

  // ── Copy ───────────────────────────────────────────────────────────────────

  const handleCopy = async () => {
    if (!currentContent) return;
    await navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Edit content ───────────────────────────────────────────────────────────

  const handleContentChange = (value: string) => {
    setContent((prev) => ({ ...prev, [activeTab]: value }));
  };

  // ── Character / word count ─────────────────────────────────────────────────

  const wordCount = currentContent
    ? currentContent.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = currentContent?.length ?? 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Wand2 className="w-4.5 h-4.5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            AI Idea Generator
          </h2>
        </div>
        <p className="mt-1 text-sm text-text-secondary pl-12">
          Select a format and let AI generate publish-ready content from your idea.
        </p>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Left Panel: Input ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-5"
        >
          <div className="p-5 rounded-2xl bg-surface/50 border border-border space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-text-primary">
                Your Idea
              </span>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-medium text-text-tertiary mb-1.5 block">
                Title
              </label>
              <input
                type="text"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="e.g. 5 AM Morning Routine for College Students"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-text-tertiary mb-1.5 block">
                Description
              </label>
              <textarea
                rows={5}
                value={ideaDescription}
                onChange={(e) => setIdeaDescription(e.target.value)}
                placeholder="Describe your idea in detail — the more context, the better the output..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none"
              />
            </div>

            {/* Generate Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGenerate(false)}
              disabled={!canGenerate || isGenerating}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-600/20 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating for all platforms...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  {hasGenerated ? "Regenerate All" : "Repurpose with AI"}
                </>
              )}
            </motion.button>
          </div>

          {/* Format Selection */}
          <div className="p-4 rounded-2xl bg-surface/30 border border-border">
            <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-3">
              Select Format
            </p>
            <div className="space-y-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setCopied(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors border",
                    activeTab === tab.key 
                      ? "bg-surface border-violet-500/30" 
                      : "bg-transparent border-transparent hover:bg-surface/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      tab.bgColor
                    )}
                  >
                    <tab.icon className={cn("w-4 h-4", tab.color)} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={cn(
                      "text-sm font-medium",
                      activeTab === tab.key ? "text-text-primary" : "text-text-secondary"
                    )}>
                      {tab.label}
                    </span>
                    <span className="text-[11px] text-text-tertiary">
                      {tab.description}
                    </span>
                  </div>
                  {activeTab === tab.key && (
                    <motion.div layoutId="format-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Right Panel: Output ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="rounded-2xl bg-surface/50 border border-border overflow-hidden min-h-[500px]">

            {/* Content Area */}
            <div className="relative">
              {/* Toolbar */}
              {hasGenerated && (
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface/30">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium",
                        currentTab.bgColor,
                        currentTab.color
                      )}
                    >
                      <currentTab.icon className="w-3 h-3" />
                      {currentTab.label}
                    </div>
                    <span className="text-[11px] text-text-tertiary">
                      {wordCount} words · {charCount} chars
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Copy */}
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={handleCopy}
                      disabled={!currentContent}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        copied
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "text-text-tertiary hover:text-text-secondary hover:bg-surface-hover"
                      )}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </motion.button>

                    {/* Regenerate */}
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleGenerate(true)}
                      disabled={isGenerating}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-all disabled:opacity-40"
                    >
                      <RefreshCw
                        className={cn(
                          "w-3 h-3",
                          isGenerating && "animate-spin"
                        )}
                      />
                      Redo
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Editor / Empty State */}
              <AnimatePresence mode="wait">
                {hasGenerated ? (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="p-4"
                  >
                    <textarea
                      ref={textareaRef}
                      value={currentContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className="w-full min-h-[460px] px-4 py-3.5 rounded-xl bg-background border border-border text-sm text-text-primary leading-relaxed focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/15 transition-all resize-y font-sans"
                      placeholder="Generated content will appear here..."
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center min-h-[500px] text-center px-6"
                  >
                    {isGenerating || isSuccess ? (
                      <div className="flex flex-col items-center justify-center py-6">
                        <AnimatePresence mode="wait">
                          {isSuccess ? (
                            <motion.div 
                              key="success"
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.5, opacity: 0 }}
                              className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-emerald-500/30"
                            >
                              <Check className="w-10 h-10 text-emerald-400" />
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="thinking"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="w-full max-w-sm flex flex-col items-center"
                            >
                              <div className="relative w-20 h-20 mb-8 mx-auto">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                  className="absolute inset-0 rounded-3xl bg-violet-500/20"
                                />
                                <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center border border-violet-500/30 overflow-hidden shadow-premium glass-premium">
                                  <motion.div
                                    animate={{ y: ["-100%", "100%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 h-[200%] bg-gradient-to-b from-transparent via-violet-500/30 to-transparent"
                                  />
                                  <Wand2 className="w-8 h-8 text-violet-400 relative z-10" />
                                </div>
                              </div>
                              
                              <p className="text-base font-bold text-text-primary mb-2">
                                {PROGRESS_STEPS[progressStep]}
                              </p>
                              
                              {/* Progress Bar */}
                              <div className="w-full h-2 rounded-full bg-surface-hover overflow-hidden mb-4 border border-border/50">
                                <motion.div 
                                  className="h-full bg-brand-gradient"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs font-medium text-text-tertiary">
                                <Clock className="w-3.5 h-3.5" />
                                Est. time: ~{Math.ceil(timeRemaining)}s
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center mb-5">
                          <Wand2 className="w-7 h-7 text-text-tertiary" />
                        </div>
                        <p className="text-sm font-medium text-text-secondary mb-1">
                          Select a format and hit Generate
                        </p>
                        <p className="text-xs text-text-tertiary max-w-xs mx-auto">
                          AI will craft publish-ready content tailored exactly to the {currentTab.label} format.
                        </p>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
