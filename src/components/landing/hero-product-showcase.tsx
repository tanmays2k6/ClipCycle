"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, TrendingUp, Users, Target, Activity } from "lucide-react";
import { cn } from "@/utils/cn";

export function HeroProductShowcase() {
  const [activeStep, setActiveStep] = useState(0);
  const [toastIndex, setToastIndex] = useState(0);

  // Cycling states for the animation
  // 0: Capturing
  // 1: AI Processing
  // 2: Organized & Generating
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toasts = [
    "✓ Screenshot Imported",
    "✓ AI Generated Keywords",
    "✓ Voice Transcribed",
    "✓ LinkedIn Draft Ready"
  ];

  useEffect(() => {
    const toastInterval = setInterval(() => {
      setToastIndex((prev) => (prev + 1) % toasts.length);
    }, 3500);
    return () => clearInterval(toastInterval);
  }, [toasts.length]);

  return (
    <div className="relative w-full h-[800px] flex items-center justify-center perspective-[1200px]">
      
      {/* BACKGROUND (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />
        {/* Glow Blobs */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.12, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-cyan-500 rounded-full blur-[100px]"
        />
      </div>

      {/* CONNECTION LINES (z-10) */}
      {/* We use SVGs to draw curves from inputs to dashboard */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-40">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        
        {/* Top Left Curve */}
        <path d="M 120 200 C 250 200, 300 350, 400 400" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
        <motion.circle r="3" fill="#60a5fa" 
          animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ offsetPath: "path('M 120 200 C 250 200, 300 350, 400 400')" }}
        />
        
        {/* Bottom Left Curve */}
        <path d="M 100 600 C 250 600, 300 450, 400 400" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
        <motion.circle r="3" fill="#c084fc" 
          animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
          style={{ offsetPath: "path('M 100 600 C 250 600, 300 450, 400 400')" }}
        />

        {/* Center Left Curve */}
        <path d="M 80 400 C 200 400, 300 400, 400 400" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
        <motion.circle r="3" fill="#2dd4bf" 
          animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 1 }}
          style={{ offsetPath: "path('M 80 400 C 200 400, 300 400, 400 400')" }}
        />
      </svg>

      {/* FLOATING INPUT SOURCES (z-20) */}
      <div className="absolute inset-0 z-20 pointer-events-none hidden md:block">
        <FloatingCard top="15%" left="5%" delay={0} icon="📷" title="Instagram" />
        <FloatingCard top="10%" right="15%" delay={1} icon="▶" title="YouTube" />
        <FloatingCard bottom="15%" left="2%" delay={0.5} icon="🎤" title="Voice" />
        <FloatingCard bottom="10%" right="5%" delay={1.5} icon="🖼" title="Screenshot" />
        <FloatingCard top="45%" left="-5%" delay={0.8} icon="📝" title="Text" />
        <FloatingCard top="40%" right="-5%" delay={1.2} icon="🔖" title="Bookmark" />
      </div>

      {/* DASHBOARD COMPOSITION */}
      <motion.div 
        className="relative z-30 flex flex-col items-center pointer-events-auto"
        animate={{ scale: [1, 1.01, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ rotateY: -1, rotateX: 1, scale: 1.02 }}
      >
        {/* AI Status Badge */}
        <div className="absolute -top-12 z-40">
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-purple-100/90 backdrop-blur-md border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                AI Organizing Ideas...
              </motion.div>
            )}
            {activeStep === 2 && (
              <motion.div 
                key="organized"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-100/90 backdrop-blur-md border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Organized
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Browser Dashboard Window */}
        <div className="w-full max-w-[340px] md:max-w-[580px] bg-card/95 backdrop-blur-xl rounded-[28px] border border-border/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative z-30">
          
          {/* Header */}
          <div className="h-12 bg-secondary/80 border-b border-border/50 flex items-center px-4 gap-2 backdrop-blur-md">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="mx-auto px-4 py-1 rounded-md bg-card border border-border/50 text-[11px] text-muted-foreground font-bold tracking-wide w-48 text-center truncate">
              ClipCycle Vault
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden h-[400px]">
            {/* Soft gradient in background of dashboard */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="flex items-center justify-between">
              <h3 className="text-[22px] font-bold text-foreground">Morning Routine for Students</h3>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Idea</span>
            </div>

            <div className="flex gap-2">
              <span className="text-xs font-semibold text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg flex items-center gap-1">
                📷 Instagram Save
              </span>
              <span className="text-xs font-semibold text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg flex items-center gap-1">
                🎤 Voice Memo
              </span>
              <span className="text-xs font-semibold text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg flex items-center gap-1">
                🔖 Bookmarks
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-secondary/50 border border-border/50 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm font-bold text-foreground">AI Analysis Complete</span>
              </div>
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Keywords</span>
                <div className="flex flex-wrap gap-2">
                  {["Productivity", "College", "Morning", "Fitness"].map(kw => (
                    <span key={kw} className="px-3 py-1 text-xs font-bold bg-card border border-border shadow-sm rounded-md text-foreground">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-between items-center pt-4 border-t border-border/50">
              <span className="text-sm font-bold text-foreground">Repurpose Into</span>
              <button className="bg-foreground text-background px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-foreground/90 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                Generate <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Insights Panel (Below Dashboard) */}
        <div className="mt-6 w-full max-w-[340px] md:max-w-[540px] bg-card/90 backdrop-blur-lg border border-border rounded-2xl p-4 shadow-xl flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Trending Topic</span>
              <span className="text-sm font-bold text-foreground">Morning Productivity</span>
            </div>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-3 hidden sm:flex">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Target className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Best Platform</span>
              <span className="text-sm font-bold text-foreground">Instagram Reels</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-primary">95%</span>
            <span className="text-xs font-bold text-muted-foreground block">Viral Potential</span>
          </div>
        </div>

        {/* Generated Content Slide-outs */}
        <AnimatePresence>
          {activeStep === 2 && (
            <>
              <GeneratedCard 
                top="15%" 
                right="-20%" 
                delay={0}
                icon="📱" 
                title="Instagram Reel" 
                desc="Morning Routine Students" 
              />
              <GeneratedCard 
                top="40%" 
                right="-25%" 
                delay={0.2}
                icon="💼" 
                title="LinkedIn Post" 
                desc="How Morning Habits Improved My Grades" 
              />
              <GeneratedCard 
                top="65%" 
                right="-15%" 
                delay={0.4}
                icon="🐦" 
                title="Twitter Thread" 
                desc="7 Lessons from Waking Up Early" 
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* PERFORMANCE METRICS (z-20) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-8 z-20 pointer-events-none w-full max-w-4xl px-4 justify-center">
        <MetricCard value="98%" label="Ideas Organized" />
        <MetricCard value="4 Sec" label="Avg Processing" />
        <MetricCard value="10×" label="Faster Retrieval" />
      </div>

      {/* TOAST NOTIFICATIONS (z-50) */}
      <div className="absolute top-10 right-10 z-50 pointer-events-none hidden md:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={toastIndex}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-foreground text-background px-5 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2"
          >
            {toasts[toastIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

function FloatingCard({ top, left, right, bottom, delay, icon, title }: any) {
  return (
    <motion.div
      className="absolute bg-card/80 backdrop-blur-md rounded-[18px] p-3 shadow-lg border border-border/60 flex items-center gap-3 w-[140px] z-20 cursor-default hover:bg-card"
      style={{ top, left, right, bottom }}
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
      whileHover={{ rotate: 2, scale: 1.05 }}
    >
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-lg">
        {icon}
      </div>
      <span className="text-[13px] font-bold text-foreground">{title}</span>
    </motion.div>
  );
}

function GeneratedCard({ top, right, delay, icon, title, desc }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", damping: 20, stiffness: 200, delay }}
      className="absolute z-40 w-[240px] bg-card rounded-2xl shadow-xl border border-border p-4 hidden md:flex flex-col gap-2 pointer-events-auto hover:scale-105 transition-transform"
      style={{ top, right }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-[13px] font-bold text-foreground">{title}</span>
        </div>
        <div className="bg-green-100 text-green-700 w-5 h-5 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground font-medium leading-relaxed truncate">{desc}</p>
    </motion.div>
  );
}

function MetricCard({ value, label }: { value: string, label: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card/60 backdrop-blur-sm border border-white/40 shadow-sm rounded-2xl px-4 md:px-6 py-4 flex flex-col items-center flex-1 md:flex-none"
    >
      <span className="text-xl md:text-3xl font-black text-foreground">{value}</span>
      <span className="text-[11px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1 text-center">{label}</span>
    </motion.div>
  );
}
