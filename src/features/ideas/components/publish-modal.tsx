"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Calendar, Copy, Download, Loader2, Check, Hash } from "lucide-react";
import { Idea, IdeaPlatform } from "@/types/database";
import { PublishService } from "../services/publish-service";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { format } from "date-fns";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Idea | null;
  initialPlatform?: IdeaPlatform;
  initialContent?: string;
  onPublishSuccess?: () => void;
}

const PLATFORMS: { id: IdeaPlatform; label: string; color: string; bg: string }[] = [
  { id: "linkedin", label: "LinkedIn", color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "twitter", label: "Twitter", color: "text-sky-500", bg: "bg-sky-500/10" },
  { id: "instagram", label: "Instagram", color: "text-pink-500", bg: "bg-pink-500/10" },
  { id: "youtube", label: "YouTube", color: "text-red-500", bg: "bg-red-500/10" },
  { id: "blog", label: "Blog", color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

export function PublishModal({ isOpen, onClose, idea, initialPlatform = "linkedin", initialContent = "", onPublishSuccess }: PublishModalProps) {
  const [platform, setPlatform] = useState<IdeaPlatform>(initialPlatform);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPlatform(initialPlatform);
      setContent(initialContent);
      setTags(idea?.tags || []);
      setIsPublishing(false);
      setIsSuccess(false);
    }
  }, [isOpen, initialPlatform, initialContent, idea]);

  if (!isOpen || !idea) return null;

  const handlePublish = async () => {
    setIsPublishing(true);
    const success = await PublishService.publish(idea.id, platform, content);
    if (success) {
      setIsSuccess(true);
      toast.success(`Successfully published to ${platform}!`);
      if (onPublishSuccess) onPublishSuccess();
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2000);
    } else {
      toast.error("Failed to publish content.");
    }
    setIsPublishing(false);
  };

  const handleCopy = async () => {
    const success = await PublishService.copy(content);
    if (success) toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    PublishService.download(content, "txt", `post-${idea.id.substring(0, 6)}`);
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={!isPublishing && !isSuccess ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[5%] md:inset-auto md:left-1/2 md:-translate-x-1/2 bg-card border border-border shadow-2xl rounded-2xl z-50 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Publish Content
              </h2>
              <button
                onClick={onClose}
                disabled={isPublishing || isSuccess}
                className="p-2 rounded-xl hover:bg-surface-hover text-text-tertiary hover:text-text-primary transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center p-16 flex-1 min-h-[400px]">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
                  <Check className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">Successfully Published!</h3>
                <p className="text-text-secondary">Content published to {PLATFORMS.find(p => p.id === platform)?.label}</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Editor Column */}
                <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-border overflow-y-auto space-y-6">
                  {/* Platform Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-text-primary">Platform</label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setPlatform(p.id)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border",
                            platform === p.id
                              ? `border-${p.color.split("-")[1]}-500 ${p.bg} ${p.color}`
                              : "border-border bg-surface hover:bg-surface-hover text-text-secondary"
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-text-primary">Caption / Content</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={12}
                      className="w-full bg-background border border-border rounded-xl p-4 text-sm text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-y"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-text-primary">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-surface-hover rounded-lg text-xs font-medium text-text-secondary flex items-center gap-1.5 border border-border">
                          <Hash className="w-3 h-3 text-text-tertiary" /> {tag}
                          <button onClick={() => removeTag(tag)} className="ml-1 text-text-tertiary hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      placeholder="Add a tag and press Enter..."
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                {/* Preview Column */}
                <div className="w-full md:w-[400px] bg-surface/30 p-6 overflow-y-auto flex flex-col">
                  <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    Social Preview
                  </h3>
                  <div className="flex-1 rounded-2xl bg-card border border-border p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-surface-hover border border-border"></div>
                      <div>
                        <div className="h-4 w-24 bg-surface-hover rounded mb-1"></div>
                        <div className="h-3 w-16 bg-surface-hover rounded opacity-50"></div>
                      </div>
                    </div>
                    <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
                      {content || "Your content preview will appear here..."}
                    </p>
                    {tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {tags.map(t => <span key={t} className="text-sm text-primary">#{t}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            {!isSuccess && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface/50">
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="btn-outline h-10 px-4 text-sm">
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                  <button onClick={handleDownload} className="btn-outline h-10 px-4 text-sm">
                    <Download className="w-4 h-4" /> TXT
                  </button>
                </div>
                <div className="flex gap-3">
                  <button className="btn-secondary h-10 px-5 text-sm disabled:opacity-50">
                    <Calendar className="w-4 h-4" /> Schedule
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={!content.trim() || isPublishing}
                    className="btn-primary h-10 px-6 text-sm relative group overflow-hidden transition-all hover-lift"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Publish Now
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
