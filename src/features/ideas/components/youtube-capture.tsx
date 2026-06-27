"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Link2, Sparkles, ArrowRight, Play, Eye, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface YouTubeVideoPreview {
  title: string;
  channelName: string;
  thumbnailUrl: string;
  views: string;
  duration: string;
  tags: string[];
}

export function YoutubeCapture() {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<YouTubeVideoPreview | null>(null);
  const [saved, setSaved] = useState(false);

  const validateAndFetch = (inputUrl: string) => {
    setUrl(inputUrl);
    if (!inputUrl) {
      setIsValid(null);
      setPreview(null);
      return;
    }

    const isYt = inputUrl.includes("youtube.com") || inputUrl.includes("youtu.be");
    setIsValid(isYt);

    if (isYt) {
      setIsLoading(true);
      setPreview(null);
      // Simulate API fetch details
      setTimeout(() => {
        setPreview({
          title: "How I Built a Startup in 24 Hours Using Cursor and Next.js",
          channelName: "DevFlow Labs",
          thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
          views: "148,290 views",
          duration: "12:45",
          tags: ["startup", "nextjs", "cursor ai", "saas", "indie hacker"],
        });
        setIsLoading(false);
      }, 1500);
    } else {
      setPreview(null);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div>
        <label className="text-sm font-medium text-text-secondary mb-1.5 block">
          YouTube URL
        </label>
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => validateAndFetch(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
            className={cn(
              "w-full pl-11 pr-4 py-3 rounded-xl bg-background border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none transition-all",
              isValid === false
                ? "border-red-500/50 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20"
                : isValid === true
                ? "border-violet-500/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                : "border-border focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
            )}
          />
          <Link2 className="absolute left-4 top-3.5 w-4 h-4 text-text-tertiary" />
        </div>
        {isValid === false && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Please enter a valid YouTube video URL
          </p>
        )}
      </div>

      {/* Loading state */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 flex flex-col items-center justify-center space-y-3 rounded-2xl bg-surface/30 border border-border"
          >
            <div className="w-8 h-8 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
            <p className="text-xs text-text-tertiary">Analyzing YouTube link...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Card */}
      <AnimatePresence>
        {preview && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="rounded-2xl border border-border bg-surface/40 overflow-hidden shadow-xl"
          >
            {/* Video Thumbnail Area */}
            <div className="relative aspect-video w-full overflow-hidden bg-background">
              <Image
                src={preview.thumbnailUrl}
                alt="YouTube Video Thumbnail"
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110">
                  <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
                </div>
              </div>
              {/* Duration badge */}
              <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-white text-[11px] font-medium font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {preview.duration}
              </span>
            </div>

            {/* Video Details */}
            <div className="p-4 space-y-4">
              <div className="space-y-1.5 text-left">
                <h4 className="text-base font-semibold text-text-primary leading-snug">
                  {preview.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-text-tertiary">
                  <span className="font-medium text-text-secondary">{preview.channelName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {preview.views}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {preview.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* AI helper info */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-violet-500/5 border border-violet-500/10">
                <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                <p className="text-xs text-violet-300/80 text-left">
                  AI will download the video details, read public transcripts, and summarize ideas.
                </p>
              </div>

              {/* Save */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-600/20"
              >
                {saved ? (
                  <>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-300">✓</motion.span>
                    Idea Saved!
                  </>
                ) : (
                  <>
                    Save Idea
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
