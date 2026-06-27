"use client";

import { motion } from "framer-motion";
import { MessageSquare, Camera, Bookmark, Mic, StickyNote, Link as ArrowDown, FileText, LayoutGrid, Search, Wand2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Logo } from "@/components/ui/logo";

const problemCards = [
  {
    icon: Bookmark,
    title: "Ideas Lost",
    desc: "73% of brilliant ideas are forgotten because they were saved in the wrong app.",
  },
  {
    icon: Search,
    title: "Time Wasted",
    desc: "Creators waste 4+ hours every week just searching for old bookmarks and screenshots.",
  },
  {
    icon: LayoutGrid,
    title: "Apps Everywhere",
    desc: "Using 6 different apps creates friction. Friction stops you from publishing.",
  }
];

const diagramNodes = [
  { label: "WhatsApp", icon: MessageSquare, delay: 0 },
  { label: "Notes", icon: StickyNote, delay: 0.1 },
  { label: "Instagram", icon: Camera, delay: 0.2 },
  { label: "Voice", icon: Mic, delay: 0.3 },
  { label: "Bookmarks", icon: Bookmark, delay: 0.4 },
];

export function Problem() {
  return (
    <section id="problem" className="relative w-full overflow-hidden" style={{ paddingTop: "120px", paddingBottom: "120px" }}>
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="container-premium relative z-10 mx-auto max-w-[1200px] flex flex-col items-center text-center">
        
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[12px] uppercase tracking-[0.2em] font-semibold text-text-tertiary mb-[24px]"
        >
          The Problem
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-bold text-text-primary tracking-tight"
          style={{ fontSize: "clamp(32px, 5vw, 64px)", lineHeight: 1.1, maxWidth: "900px" }}
        >
          Your best ideas are scattered across <span className="text-text-secondary">a dozen different apps.</span>
        </motion.h2>

        {/* Short Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary max-w-[600px] mt-[24px]"
          style={{ fontSize: "20px", lineHeight: 1.5 }}
        >
          You capture inspiration everywhere, but when it's time to create, you can never find what you saved.
        </motion.p>

        {/* Cards */}
        <div className="mt-[48px] flex flex-col md:flex-row items-center justify-center gap-[24px] w-full">
          {problemCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="glass hover-lift flex flex-col items-start text-left shrink-0"
              style={{ width: "100%", maxWidth: "380px", height: "220px", padding: "32px", borderRadius: "20px" }}
            >
              <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center mb-4 border border-border/50">
                <card.icon className="w-5 h-5 text-text-secondary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2" style={{ fontSize: "28px", lineHeight: 1.2 }}>
                {card.title}
              </h3>
              <p className="text-text-secondary" style={{ fontSize: "18px", lineHeight: 1.5 }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Flow Animation */}
        <div className="mt-[64px] w-full max-w-[900px] flex flex-col items-center">
          
          {/* Top Row: Scattered Sources */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {diagramNodes.map((node, i) => (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + node.delay }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border shadow-sm"
              >
                <node.icon className="w-4 h-4 text-text-tertiary" />
                <span className="text-sm font-medium text-text-secondary">{node.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Animated Arrows down */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            whileInView={{ opacity: 1, height: "60px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            className="w-px bg-gradient-to-b from-border via-violet-500/50 to-violet-500 my-[16px] relative flex flex-col items-center justify-end"
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-violet-500 absolute -bottom-4"
            >
              <ArrowDown className="w-4 h-4" />
            </motion.div>
          </motion.div>

          {/* Center: ClipCycle Vault */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-surface-hover border border-border mt-[16px] shadow-lg"
          >
            <Logo size={40} animated />
            <span className="text-base font-bold text-text-primary">ClipCycle Vault</span>
          </motion.div>

          {/* Animated Arrows down */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            whileInView={{ opacity: 1, height: "40px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="w-px bg-gradient-to-b from-border via-violet-500/50 to-violet-500 my-[16px] relative flex flex-col items-center justify-end"
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
              className="text-violet-500 absolute -bottom-4"
            >
              <ArrowDown className="w-4 h-4" />
            </motion.div>
          </motion.div>

          {/* Next Row: AI Analysis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 2.0 }}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 mt-[16px] shadow-glow"
          >
            <Wand2 className="w-5 h-5 text-violet-400" />
            <span className="text-base font-bold text-text-primary">AI Analysis</span>
          </motion.div>

          {/* Animated Arrows down */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            whileInView={{ opacity: 1, height: "40px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="w-px bg-gradient-to-b from-border via-emerald-500/50 to-emerald-500 my-[16px] relative flex flex-col items-center justify-end"
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }}
              className="text-emerald-500 absolute -bottom-4"
            >
              <ArrowDown className="w-4 h-4" />
            </motion.div>
          </motion.div>

          {/* Final Row: Published Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 2.6 }}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mt-[16px]"
          >
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="text-base font-bold text-text-primary">Published Content</span>
          </motion.div>

        </div>

        {/* The Solution */}
        <div className="mt-[120px] w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12px] uppercase tracking-[0.2em] font-semibold text-violet-400 mb-[24px]"
          >
            The Solution
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[800px] glass rounded-[32px] p-8 md:p-12 border border-border shadow-premium flex flex-col md:flex-row items-center text-left gap-8 md:gap-12"
          >
            <div className="flex-1">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 flex items-center justify-center shadow-glow mb-6">
                <Logo size={48} animated />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 tracking-tight">
                ClipCycle Vault
              </h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                One centralized workspace where AI automatically <span className="text-text-primary font-medium">Organizes</span>, <span className="text-text-primary font-medium">Tags</span>, <span className="text-text-primary font-medium">Searches</span>, and <span className="text-text-primary font-medium">Repurposes</span> your scattered ideas.
              </p>
            </div>
            
            <div className="flex-1 w-full bg-surface-hover rounded-2xl border border-border p-6 flex flex-col gap-4">
               {/* Mini representation of the AI actions */}
               {[
                 { icon: LayoutGrid, text: "Organizes automatically", color: "text-blue-400" },
                 { icon: Bookmark, text: "Tags intelligently", color: "text-pink-400" },
                 { icon: Search, text: "Searches semantically", color: "text-amber-400" },
                 { icon: Wand2, text: "Repurposes instantly", color: "text-violet-400" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
                    <item.icon className={cn("w-5 h-5", item.color)} />
                    <span className="text-sm font-medium text-text-primary">{item.text}</span>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
