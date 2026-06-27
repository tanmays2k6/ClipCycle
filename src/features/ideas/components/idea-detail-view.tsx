"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  Hash,
  Edit2,
  Check,
  Archive,
  Trash2,
  Sparkles,
  Play,
  Layers,
  Briefcase,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  X,
  AlertTriangle,
  Loader2,
  Wand2,
  Clock,
} from "lucide-react";

const ANALYSIS_STEPS = ["Reading idea...", "Extracting keywords...", "Identifying audience...", "Drafting summary..."];
const CONTENT_STEPS = ["Analyzing idea...", "Optimizing for platform...", "Writing content..."];
import { AudioPlayer } from "./audio-player";
import { cn } from "@/utils/cn";
import type { Idea, IdeaStatus, AIAnalysis, GeneratedContent, ContentType } from "@/types/database";

interface IdeaDetailViewProps {
  idea: Idea;
  aiAnalysis: AIAnalysis | null;
  generatedContent: GeneratedContent[];
  prevIdeaId: string | null;
  nextIdeaId: string | null;
}

export function IdeaDetailView({ 
  idea, 
  aiAnalysis, 
  generatedContent, 
  prevIdeaId, 
  nextIdeaId 
}: IdeaDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Component States
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(idea.title);
  const [editedDescription, setEditedDescription] = useState(idea.description || "");
  const [newTag, setNewTag] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  
  // Action confirmations
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [analysisProgressStep, setAnalysisProgressStep] = useState(0);
  const [analysisProgressPercent, setAnalysisProgressPercent] = useState(0);

  const [generatingContentType, setGeneratingContentType] = useState<ContentType | null>(null);
  const [contentProgressStep, setContentProgressStep] = useState(0);
  const [contentProgressPercent, setContentProgressPercent] = useState(0);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowLeft" && prevIdeaId) {
        router.push(`/dashboard/ideas/${prevIdeaId}`);
      } else if (e.key === "ArrowRight" && nextIdeaId) {
        router.push(`/dashboard/ideas/${nextIdeaId}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevIdeaId, nextIdeaId, router]);

  // Handle auto-generation from URL parameters
  useEffect(() => {
    const action = searchParams.get("action");
    const template = searchParams.get("template");
    
    if (action === "generate" && template) {
      // Small timeout to allow UI to settle before triggering
      const timer = setTimeout(() => {
        triggerAIGeneration(template as ContentType);
        // Remove query params from URL without refreshing
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("action");
        newUrl.searchParams.delete("template");
        window.history.replaceState({}, "", newUrl.toString());
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSaveEdit = async () => {
    setIsEditing(false);
    // Optimistic UI update (mocked until real API is built)
  };

  const handleCancelEdit = () => {
    setEditedTitle(idea.title);
    setEditedDescription(idea.description || "");
    setIsEditing(false);
  };

  const changeStatus = (_statusToChange: IdeaStatus) => {
    setStatusDropdownOpen(false);
    // Optimistic status update (mocked until real API is built)
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    // Simulate delete and redirect to Ideas list
    router.push("/dashboard/ideas");
  };

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    setNewTag("");
    // Optimistic tag insert (mocked until real API is built)
  };

  const removeTag = (tag: string) => {
    // Optimistic tag remove (mocked until real API is built)
  };

  const generateAnalysis = async () => {
    if (isGeneratingAnalysis || generatingContentType !== null) return;
    setIsGeneratingAnalysis(true);
    setAnalysisProgressStep(0);
    setAnalysisProgressPercent(0);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const percent = Math.min((elapsed / 8) * 100, 99);
      setAnalysisProgressPercent(percent);
      setAnalysisProgressStep(Math.min(Math.floor((percent / 100) * ANALYSIS_STEPS.length), ANALYSIS_STEPS.length - 1));
    }, 100);

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea_id: idea.id,
          title: idea.title,
          description: idea.description,
          tags: idea.tags,
          platform: idea.platforms?.[0] || "",
        }),
      });
      clearInterval(interval);
      if (!res.ok) throw new Error("Failed to generate analysis.");
      setAnalysisProgressPercent(100);
      toast.success("AI Analysis generated successfully!");
      router.refresh();
    } catch (error) {
      clearInterval(interval);
      // Silent fail in production
      toast.error("AI generation failed.");
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  const triggerAIGeneration = async (type: ContentType) => {
    if (isGeneratingAnalysis || generatingContentType !== null) return;
    setGeneratingContentType(type);
    setContentProgressStep(0);
    setContentProgressPercent(0);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const percent = Math.min((elapsed / 6) * 100, 99);
      setContentProgressPercent(percent);
      setContentProgressStep(Math.min(Math.floor((percent / 100) * CONTENT_STEPS.length), CONTENT_STEPS.length - 1));
    }, 100);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea_id: idea.id,
          title: idea.title,
          description: idea.description,
          content_type: type,
        }),
      });
      clearInterval(interval);
      if (!res.ok) throw new Error("Failed to generate content.");
      setContentProgressPercent(100);
      toast.success("Content generated successfully!");
      router.refresh();
    } catch (error) {
      clearInterval(interval);
      // Silent fail in production
      toast.error("AI generation failed.");
    } finally {
      setGeneratingContentType(null);
    }
  };

  // Status mapping colors
  const statusColors: Record<IdeaStatus, { text: string; bg: string; border: string }> = {
    pending: { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
    draft: { text: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    used: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    archived: { text: "text-text-tertiary", bg: "bg-surface-hover", border: "border-border" },
  };

  const currentStatus = statusColors[idea.status];
  
  // Format Date
  const formattedDate = format(parseISO(idea.created_at), "MMM d, yyyy");

  // Extrapolate AI fields mapping
  const hook = aiAnalysis?.strengths?.[0] || null;
  const cta = aiAnalysis?.strengths?.[1] || null;
  const audience = aiAnalysis?.improvements?.[0] || null;
  const tone = aiAnalysis?.improvements?.[1] || null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Breadcrumb / Nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/ideas"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-surface/50 border border-border text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all"
            aria-label="Back to Vault"
            title="Back to Vault"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
              <span className="cursor-default">Workspace</span>
              <span>/</span>
              <Link href="/dashboard/ideas" className="hover:underline">Ideas</Link>
              <span>/</span>
              <span className="text-text-secondary truncate max-w-[120px] sm:max-w-xs">{idea.title}</span>
            </div>
            <h2 className="text-lg font-bold text-text-primary tracking-tight mt-0.5 hidden sm:block truncate max-w-sm">
              {idea.title}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {prevIdeaId && (
            <Link
              href={`/dashboard/ideas/${prevIdeaId}`}
              className="min-w-[44px] min-h-[44px] sm:flex items-center justify-center rounded-xl bg-surface/50 border border-border text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors hidden"
              aria-label="Previous Idea"
              title="Previous Idea (Arrow Left)"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          {nextIdeaId && (
            <Link
              href={`/dashboard/ideas/${nextIdeaId}`}
              className="min-w-[44px] min-h-[44px] sm:flex items-center justify-center rounded-xl bg-surface/50 border border-border text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors hidden"
              aria-label="Next Idea"
              title="Next Idea (Arrow Right)"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
          <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors",
              isEditing
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                : "bg-surface/50 border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            )}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Done
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </>
            )}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 transition-colors shrink-0"
            aria-label="Delete Idea"
            title="Delete Idea"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Original Idea */}
          <div className="p-6 rounded-2xl bg-surface/40 border border-border space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              {/* Left detail info */}
              <div className="flex items-center gap-3 text-xs text-text-tertiary">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-border capitalize">
                  {idea.source}
                </span>
                {idea.source_label && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-surface border border-border">
                      {idea.source_label}
                    </span>
                  </>
                )}
              </div>

              {/* Status Dropdown */}
              <div className="relative self-start sm:self-center">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                    currentStatus.text,
                    currentStatus.bg,
                    currentStatus.border
                  )}
                >
                  <span className="capitalize">{idea.status}</span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
                </button>

                <AnimatePresence>
                  {statusDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setStatusDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-1.5 w-32 rounded-xl bg-surface border border-border shadow-xl z-40 p-1 space-y-0.5"
                      >
                        {(["pending", "draft", "used", "archived"] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => changeStatus(st)}
                            className={cn(
                              "w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                              idea.status === st
                                ? "bg-violet-500/10 text-violet-400"
                                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                            )}
                          >
                            {st}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Editable Content */}
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-text-tertiary mb-1 block">Title</label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-text-primary focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-tertiary mb-1 block">Description</label>
                    <textarea
                      rows={5}
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-text-primary focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary hover:text-text-primary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editedTitle.trim()}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-medium hover:from-violet-500 hover:to-indigo-500 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-left">
                  <h3 className="text-xl font-bold text-text-primary tracking-tight">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {idea.description || "No description provided."}
                  </p>
                </div>
              )}
            </div>
            
            {/* Audio Player for Voice Notes */}
            {idea.source === "voice" && idea.audio_url && (
              <div className="pt-2">
                <AudioPlayer filePath={idea.audio_url} duration={idea.duration} />
              </div>
            )}
            
            {idea.original_transcript && idea.original_transcript !== idea.description && (
              <div className="pt-2">
                <details className="text-xs text-text-tertiary">
                  <summary className="cursor-pointer hover:text-text-secondary transition-colors inline-block mb-1">
                    View Original Transcript
                  </summary>
                  <div className="p-3 bg-surface-hover rounded-lg border border-border mt-1 text-text-secondary whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                    {idea.original_transcript}
                  </div>
                </details>
              </div>
            )}
            
            {idea.source_url && (
              <div className="pt-2">
                <a href={idea.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Original Source
                </a>
              </div>
            )}
          </div>

          {/* AI Analysis Panel */}
          <div className="p-6 rounded-2xl bg-surface/40 border border-border space-y-4 shadow-sm">
             <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                AI Analysis
              </h4>
            </div>
            
            {aiAnalysis ? (
              <div className="space-y-4 pt-2">
                {aiAnalysis.summary && (
                  <div>
                    <h5 className="text-xs font-semibold text-text-tertiary mb-1">Summary</h5>
                    <p className="text-sm text-text-secondary leading-relaxed">{aiAnalysis.summary}</p>
                  </div>
                )}
                
                {hook && (
                  <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
                    <h5 className="text-xs font-bold text-violet-400 mb-1">Suggested Hook</h5>
                    <p className="text-sm text-text-primary italic">&quot;{hook}&quot;</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {audience && (
                    <div>
                      <h5 className="text-xs font-semibold text-text-tertiary mb-1">Audience</h5>
                      <p className="text-sm text-text-secondary">{audience}</p>
                    </div>
                  )}
                  {tone && (
                    <div>
                      <h5 className="text-xs font-semibold text-text-tertiary mb-1">Tone</h5>
                      <p className="text-sm text-text-secondary">{tone}</p>
                    </div>
                  )}
                </div>
                
                {cta && (
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <h5 className="text-xs font-bold text-emerald-400 mb-1">Call to Action</h5>
                    <p className="text-sm text-text-primary">&quot;{cta}&quot;</p>
                  </div>
                )}

                {aiAnalysis.suggested_tags && aiAnalysis.suggested_tags.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold text-text-tertiary mb-2">Keywords / Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.suggested_tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-surface border border-border text-text-secondary">
                          <Hash className="w-3 h-3 opacity-50" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 px-4 text-center border border-dashed border-border rounded-2xl bg-surface/20 mt-4">
                {isGeneratingAnalysis ? (
                  <div className="w-full max-w-[240px] mx-auto flex flex-col items-center py-2">
                    <div className="relative w-12 h-12 mb-4">
                      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-xl bg-violet-500/20" />
                      <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center border border-violet-500/30 overflow-hidden">
                        <Wand2 className="w-5 h-5 text-violet-400 relative z-10" />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-text-primary mb-3">{ANALYSIS_STEPS[analysisProgressStep]}</p>
                    <div className="w-full h-1.5 rounded-full bg-surface-hover overflow-hidden border border-border/50">
                      <motion.div className="h-full bg-brand-gradient" initial={{ width: 0 }} animate={{ width: `${analysisProgressPercent}%` }} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-6 h-6 text-violet-400" />
                    </div>
                    <h5 className="text-base font-semibold text-text-primary mb-2">No Analysis Yet</h5>
                    <p className="text-xs text-text-tertiary max-w-[240px] mx-auto mb-6 leading-relaxed">
                      Generate an AI analysis to get hooks, audiences, keywords, summaries, and CTAs tailored to this idea.
                    </p>
                    <button 
                      onClick={generateAnalysis}
                      disabled={generatingContentType !== null}
                      className="btn-primary glow px-5 py-2.5 mx-auto"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate AI Analysis
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Repurposed Content Panel */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-surface/40 border border-border space-y-4 shadow-sm">
            <div className="text-left">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                Repurposed Content
              </h4>
              <p className="text-xs text-text-tertiary mt-1 leading-relaxed">
                Content generated from this idea for your social channels.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {generatedContent.length > 0 ? (
                generatedContent.map((content) => (
                  <div key={content.id} className="p-3 rounded-xl bg-surface border border-border group cursor-pointer hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-text-primary capitalize flex items-center gap-1.5">
                        {content.platform === "instagram" && <Play className="w-3.5 h-3.5 text-pink-400" />}
                        {content.platform === "linkedin" && <Briefcase className="w-3.5 h-3.5 text-blue-400" />}
                        {content.platform === "twitter" && <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />}
                        {content.platform}
                      </span>
                      <span className="text-[10px] text-text-tertiary">
                        {format(parseISO(content.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary whitespace-pre-wrap">{content.body}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center px-4 border border-dashed border-border rounded-2xl bg-surface/20">
                  {generatingContentType === "post" ? (
                    <div className="w-full max-w-[240px] mx-auto flex flex-col items-center py-2">
                      <div className="relative w-12 h-12 mb-4">
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-xl bg-emerald-500/20" />
                        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center border border-emerald-500/30 overflow-hidden">
                          <Wand2 className="w-5 h-5 text-emerald-400 relative z-10" />
                        </div>
                      </div>
                      <p className="text-sm font-bold text-text-primary mb-3">{CONTENT_STEPS[contentProgressStep]}</p>
                      <div className="w-full h-1.5 rounded-full bg-surface-hover overflow-hidden border border-border/50">
                        <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${contentProgressPercent}%` }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 mx-auto rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                        <Layers className="w-6 h-6 text-emerald-400" />
                      </div>
                      <p className="text-sm font-semibold text-text-primary mb-1">No content generated</p>
                      <p className="text-xs text-text-tertiary mb-5 max-w-[200px] mx-auto leading-relaxed">
                        Use AI to turn this idea into ready-to-publish posts across all your platforms.
                      </p>
                      <button 
                        onClick={() => triggerAIGeneration("post")}
                        disabled={isGeneratingAnalysis || generatingContentType !== null}
                        className="btn-primary glow px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 mx-auto"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate Content
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Quick Generate Actions */}
            <div className="border-t border-border pt-4 mt-2">
               <h5 className="text-xs font-semibold text-text-tertiary mb-2">Generate More</h5>
               <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => triggerAIGeneration("script")}
                    disabled={isGeneratingAnalysis || generatingContentType !== null}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-surface/30 hover:border-pink-500/30 hover:bg-pink-500/5 transition-colors gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingContentType === "script" ? <Loader2 className="w-4 h-4 text-pink-400 animate-spin" /> : <Play className="w-4 h-4 text-pink-400" />}
                    <span className="text-[10px] font-semibold text-text-secondary">Reel Script</span>
                  </button>
                  <button
                    onClick={() => triggerAIGeneration("post")}
                    disabled={isGeneratingAnalysis || generatingContentType !== null}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-surface/30 hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingContentType === "post" ? <Loader2 className="w-4 h-4 text-blue-400 animate-spin" /> : <Briefcase className="w-4 h-4 text-blue-400" />}
                    <span className="text-[10px] font-semibold text-text-secondary">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => triggerAIGeneration("outline")}
                    disabled={isGeneratingAnalysis || generatingContentType !== null}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-surface/30 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingContentType === "outline" ? <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" /> : <Layers className="w-4 h-4 text-emerald-400" />}
                    <span className="text-[10px] font-semibold text-text-secondary">Carousel</span>
                  </button>
                  <button
                    onClick={() => triggerAIGeneration("thread")}
                    disabled={isGeneratingAnalysis || generatingContentType !== null}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-surface/30 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-colors gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingContentType === "thread" ? <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" /> : <MessageCircle className="w-4 h-4 text-cyan-400" />}
                    <span className="text-[10px] font-semibold text-text-secondary">Twitter</span>
                  </button>
               </div>
            </div>
          </div>
          
          {/* Card: Tags Management */}
          <div className="p-6 rounded-2xl bg-surface/40 border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-violet-400" />
                Idea Tags
              </h4>
              {isEditing && (
                <form onSubmit={addTag} className="flex gap-1">
                  <input
                    type="text"
                    placeholder="Add _tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-20 px-2 py-1 text-xs rounded-lg bg-background border border-border text-text-primary focus:outline-none focus:border-violet-500/40"
                  />
                  <button type="submit" className="px-2 py-1 rounded-lg bg-violet-600 text-white text-xs">
                    +
                  </button>
                </form>
              )}
            </div>
            <div className="flex flex-wrap gap-2 justify-start">
              {idea.tags && idea.tags.length > 0 ? idea.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-surface border border-border text-text-secondary capitalize"
                >
                  {tag}
                  {isEditing && (
                    <button
                      onClick={() => removeTag(tag)}
                      className="p-0.5 hover:bg-surface-hover rounded text-text-tertiary hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              )) : (
                <div className="w-full text-center py-6 px-4 rounded-xl border border-dashed border-border/50 bg-surface/20">
                  <div className="w-8 h-8 mx-auto rounded-lg bg-surface flex items-center justify-center mb-2">
                    <Tag className="w-4 h-4 text-violet-400" />
                  </div>
                  <p className="text-sm font-semibold text-text-primary mb-1">No tags yet</p>
                  <p className="text-xs text-text-tertiary mb-3">Add tags to organize your ideas.</p>
                  {isEditing ? (
                    <p className="text-[11px] text-brand-primary">Use the input above to add tags.</p>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="text-[11px] font-medium text-brand-primary hover:text-brand-secondary">
                      Edit to add tags &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-surface border border-border p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-text-primary">Delete Content Idea</h3>
                  <p className="text-xs text-text-tertiary mt-0.5">This action is permanent and cannot be undone.</p>
                </div>
              </div>

              <p className="text-sm text-text-secondary text-left leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-text-primary">&quot;{idea.title}&quot;</span>? All captured data, _tags, and drafts will be deleted.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-400 transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
