"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, TrendingUp, Search, Star, Users, Database } from "lucide-react";
import { cn } from "@/utils/cn";

export function AuthShowcase() {
  const [activeStep, setActiveStep] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const testimonials = [
    { text: "ClipCycle saves me 5 hours every week.", author: "Student Creator", platform: "Instagram" },
    { text: "Best organizational tool I've used this year.", author: "Design Student", platform: "Twitter" },
    { text: "My ideas finally have a reliable home.", author: "Freelance Writer", platform: "LinkedIn" }
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden min-h-screen lg:min-h-0">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-blue-400 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 -right-10 w-[500px] h-[500px] bg-cyan-400 rounded-full blur-[120px]"
        />
      </div>

      {/* SVG Connection Lines */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-40 hidden lg:block">
        <defs>
          <linearGradient id="authLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        
        {/* Left Curve */}
        <path d="M 100 250 C 250 250, 200 400, 350 400" fill="none" stroke="url(#authLineGrad)" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
        <motion.circle r="3" fill="#2563EB" 
          animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          style={{ offsetPath: "path('M 100 250 C 250 250, 200 400, 350 400')" }}
        />
        
        {/* Bottom Left Curve */}
        <path d="M 150 650 C 250 650, 250 500, 350 450" fill="none" stroke="url(#authLineGrad)" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
        <motion.circle r="3" fill="#0EA5E9" 
          animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
          style={{ offsetPath: "path('M 150 650 C 250 650, 250 500, 350 450')" }}
        />
      </svg>

      {/* Main Dashboard Preview */}
      <motion.div 
        className="relative z-30 w-full max-w-[600px] perspective-[1200px]"
        animate={{ scale: [1, 1.01, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="bg-card/90 backdrop-blur-xl rounded-[24px] border border-border shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
          
          {/* Header */}
          <div className="h-12 bg-muted border-b border-border flex items-center px-4 gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-64 h-7 bg-card rounded-md border border-border flex items-center px-3 gap-2 text-muted-foreground text-xs font-medium shadow-sm">
                <Search className="w-3 h-3" /> Search your vault...
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 flex gap-6 h-[380px]">
            {/* Sidebar Mock */}
            <div className="w-32 flex flex-col gap-3 shrink-0 hidden sm:flex">
              <div className="w-full h-8 rounded-lg bg-blue-50 border border-blue-100" />
              <div className="w-3/4 h-6 rounded-md bg-slate-100" />
              <div className="w-5/6 h-6 rounded-md bg-slate-100" />
              <div className="w-full h-6 rounded-md bg-slate-100" />
              <div className="mt-auto w-full h-10 rounded-xl bg-slate-100" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-4 relative">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Recent Ideas</h3>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-organized
                </div>
              </div>

              {/* Dynamic Content */}
              <div className="bg-muted rounded-xl border border-border p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                    <span className="text-sm font-bold">IG</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="w-32 h-4 bg-slate-200 rounded" />
                    <div className="w-20 h-3 bg-slate-100 rounded" />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeStep === 0 && (
                    <motion.div key="capture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 flex flex-col gap-2">
                      <div className="h-2 w-full bg-slate-200 rounded" />
                      <div className="h-2 w-3/4 bg-slate-200 rounded" />
                    </motion.div>
                  )}
                  {activeStep === 1 && (
                    <motion.div key="process" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                      <span className="text-xs font-semibold text-blue-700">AI extracting keywords...</span>
                    </motion.div>
                  )}
                  {activeStep === 2 && (
                    <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 flex gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-card border border-border rounded text-[10px] font-bold shadow-sm text-foreground">#Productivity</span>
                      <span className="px-2 py-1 bg-card border border-border rounded text-[10px] font-bold shadow-sm text-foreground">#College</span>
                      <div className="w-full mt-2 h-8 bg-black text-white rounded-lg flex items-center justify-center text-xs font-bold gap-2">
                        Generate Post <Sparkles className="w-3 h-3" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stats */}
        <div className="absolute -bottom-6 left-8 right-8 z-40 flex justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex-1 bg-card/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-border flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Users className="w-4 h-4" /></div>
            <div>
              <div className="text-sm font-black text-foreground leading-tight">2,400+</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Creators</div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex-1 bg-card/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-border flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Database className="w-4 h-4" /></div>
            <div>
              <div className="text-sm font-black text-foreground leading-tight">120K+</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Ideas</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Elements (Hidden on mobile) */}
      <div className="absolute inset-0 z-20 pointer-events-none hidden lg:block">
        <FloatingCard top="15%" left="15%" icon="📷" title="Instagram" delay={0} />
        <FloatingCard top="35%" left="5%" icon="🎤" title="Voice" delay={1} />
        <FloatingCard bottom="25%" left="10%" icon="📝" title="Notes" delay={2} />
        <FloatingCard top="20%" right="10%" icon="▶" title="YouTube" delay={0.5} />
        <FloatingCard bottom="35%" right="5%" icon="🔖" title="Bookmark" delay={1.5} />
      </div>

      {/* Testimonial Carousel */}
      <motion.div 
        className="absolute bottom-8 right-8 z-40 bg-card/90 backdrop-blur-xl border border-border shadow-xl rounded-2xl p-5 w-72 hidden xl:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonialIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm font-medium text-foreground italic mb-4"
          >
            "{testimonials[testimonialIndex].text}"
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {testimonials[testimonialIndex].author[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground">{testimonials[testimonialIndex].author}</span>
            <span className="text-[10px] text-muted-foreground">{testimonials[testimonialIndex].platform}</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

function FloatingCard({ top, left, right, bottom, icon, title, delay }: any) {
  return (
    <motion.div
      className="absolute bg-card/80 backdrop-blur-md rounded-2xl p-2.5 shadow-sm border border-border flex items-center gap-2.5 z-20 hover:bg-card transition-colors"
      style={{ top, left, right, bottom }}
      animate={{ y: [-5, 5, -5] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-lg shadow-sm">
        {icon}
      </div>
      <span className="text-xs font-bold text-foreground pr-2">{title}</span>
    </motion.div>
  );
}
