"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileImage, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";

export function ScreenshotCapture() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={cn(
          "relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden",
          dragging
            ? "border-violet-500/50 bg-violet-500/5"
            : file
              ? "border-border bg-surface/30"
              : "border-border hover:border-border-hover bg-surface/30 hover:bg-surface/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Screenshot preview"
                className="w-full max-h-[320px] object-contain rounded-xl"
              />
              {/* Overlay controls */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="p-2 rounded-xl bg-black/60 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* File info */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 backdrop-blur-sm">
                  <FileImage className="w-4 h-4 text-violet-400" />
                  <span className="text-xs text-white/80 truncate">
                    {file?.name}
                  </span>
                  <span className="text-xs text-white/50 shrink-0">
                    {file && (file.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 px-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
                <Upload className={cn("w-6 h-6 transition-colors", dragging ? "text-violet-400" : "text-text-tertiary")} />
              </div>
              <p className="text-sm font-medium text-text-secondary">
                {dragging ? "Drop your screenshot here" : "Drop a screenshot or click to upload"}
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                PNG, JPG, or WebP — up to 10MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title (for the idea) */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1.5 block">
              Idea Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's this screenshot about?"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
          </div>

          {/* AI Note */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
            <p className="text-xs text-violet-300/80">
              AI will extract text and context from your screenshot automatically.
            </p>
          </div>

          {/* Submit */}
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
        </motion.div>
      )}
    </div>
  );
}
