"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Link2, Sparkles, ArrowRight, Camera, Heart, MessageCircle, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface InstagramPostPreview {
  username: string;
  avatarUrl: string;
  imageUrl: string;
  caption: string;
  likes: string;
  comments: string;
}

export function InstagramCapture() {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<InstagramPostPreview | null>(null);
  const [saved, setSaved] = useState(false);

  const validateAndFetch = (inputUrl: string) => {
    setUrl(inputUrl);
    if (!inputUrl) {
      setIsValid(null);
      setPreview(null);
      return;
    }

    const isIg = inputUrl.includes("instagram.com");
    setIsValid(isIg);

    if (isIg) {
      setIsLoading(true);
      setPreview(null);
      // Simulate API fetch details
      setTimeout(() => {
        setPreview({
          username: "christravels",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
          caption: "10 travel hacks you need to know before visiting Europe this summer. Save this post for your next trip! ✈️ #traveltips #europe #solotravel",
          likes: "12.4k",
          comments: "348",
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
      <div className="form-group">
        <label className="label-base">
          Instagram URL
        </label>
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => validateAndFetch(e.target.value)}
            placeholder="https://www.instagram.com/p/..."
            className={cn(
              "input-base pl-11",
              isValid === false && "input-error"
            )}
          />
          <Link2 className="absolute left-4 top-3.5 w-4 h-4 text-text-tertiary" />
        </div>
        {isValid === false && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Please enter a valid Instagram URL
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
            <p className="text-xs text-text-tertiary">Analyzing Instagram link...</p>
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
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-surface/30">
              <div className="flex items-center gap-3">
                <Image
                  src={preview.avatarUrl}
                  alt={preview.username}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border border-border"
                />
                <div className="text-left">
                  <p className="text-h3 flex items-center gap-1.5">
                    {preview.username}
                    <Camera className="w-3.5 h-3.5 text-pink-400" />
                  </p>
                  <p className="text-caption">Instagram Creator</p>
                </div>
              </div>
            </div>

            {/* Media preview */}
            <div className="relative aspect-video sm:aspect-square max-h-[300px] overflow-hidden bg-background">
              <Image
                src={preview.imageUrl}
                alt="Instagram post media"
                width={800}
                height={800}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Engagement Stats */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center gap-4 text-white">
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  {preview.likes}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <MessageCircle className="w-4 h-4 text-white fill-white" />
                  {preview.comments}
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-4 space-y-4">
              <p className="text-body line-clamp-2 text-left">
                {preview.caption}
              </p>

              {/* AI helper info */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-violet-500/5 border border-violet-500/10">
                <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                <p className="text-xs text-violet-300/80 text-left">
                  AI will download this post details, analyze hooks, and prepare transcript options.
                </p>
              </div>

              {/* Save */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="btn-base w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/20 border-0"
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
