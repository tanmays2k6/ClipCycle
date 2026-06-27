"use client";

import { motion } from "framer-motion";
import { Search, LayoutDashboard, Calendar, Layers, Wand2 } from "lucide-react";

export function ProductPreview() {
  return (
    <section id="product" className="section-padding relative overflow-hidden bg-surface/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">
            Product Preview
          </span>
          <h2 className="mt-4 text-section max-w-2xl mx-auto text-white">
            Experience the <span>Premium Vault</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto">
            A beautiful, focused workspace designed to help you organize chaos and create content faster.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 max-w-5xl mx-auto relative perspective-[2000px]"
        >
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />

          {/* MacBook Frame */}
          <div className="relative mx-auto w-full max-w-[900px] rounded-[1.5rem] p-3 bg-surface border border-border shadow-premium rotate-x-12 translate-y-[-20px] transition-transform duration-700 hover:rotate-x-0 hover:translate-y-0" style={{ transformStyle: 'preserve-3d' }}>
            {/* Screen Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-surface rounded-b-xl z-20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-border" />
            </div>
            
            {/* Screen Content (Dashboard UI Mockup) */}
            <div className="relative w-full aspect-[16/10] bg-background rounded-xl overflow-hidden flex border border-border">
              {/* Sidebar */}
              <div className="w-48 bg-surface/50 border-r border-border p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <Wand2 className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold">ClipCycle</span>
                </div>
                {[
                  { icon: LayoutDashboard, label: "Dashboard", active: true },
                  { icon: Layers, label: "All Ideas" },
                  { icon: Wand2, label: "Generate" },
                  { icon: Calendar, label: "Calendar" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${item.active ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface'}`}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main Area */}
              <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Good morning, Creator</h3>
                  <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-text-tertiary">
                    <Search className="w-4 h-4" />
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {["Ideas Saved", "Generated Drafts", "Published"].map((stat, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-surface/40 border border-border/50">
                      <span className="text-xs text-text-tertiary">{stat}</span>
                      <div className="text-2xl font-bold mt-1">{[142, 38, 24][i]}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Ideas Masonry Mockup */}
                <h4 className="text-sm font-semibold text-text-secondary mb-4">Recent Ideas</h4>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border border-violet-500/20">
                    <span className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold mb-2 block">Instagram Carousel</span>
                    <p className="text-sm font-medium text-text-primary">5 Productivity hacks for Notion users</p>
                    <div className="mt-4 flex gap-2">
                      <span className="px-2 py-1 rounded bg-violet-500/20 text-[10px] text-violet-300">Ready to post</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface/40 border border-border/50">
                    <span className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold mb-2 block">Voice Note</span>
                    <p className="text-sm font-medium text-text-primary">&quot;Talk about how AI is changing design workflows...&quot;</p>
                    <div className="mt-4 flex gap-2">
                      <span className="px-2 py-1 rounded bg-blue-500/10 text-[10px] text-blue-400">Needs review</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Base of MacBook */}
          <div className="mx-auto w-full max-w-[1000px] h-4 bg-[#2a2a2a] rounded-b-2xl mt-[-2px] relative z-[-1] shadow-2xl flex justify-center">
            <div className="w-32 h-2 bg-[#1a1a1a] rounded-b-md" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
