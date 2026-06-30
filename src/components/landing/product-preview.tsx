"use client";

import { motion } from "framer-motion";
import { Search, LayoutDashboard, Calendar, Layers, Wand2, Plus, Sparkles, Image as ImageIcon } from "lucide-react";
import { cn } from "@/utils/cn";

export function ProductPreview() {
  return (
    <section id="product" className="section-padding relative overflow-hidden bg-background border-b border-border/50">
      {/* Faint Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container-premium relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-wider font-semibold text-primary mb-6"
          >
            Product Preview
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-h2"
          >
            Experience the Premium Vault
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-body mt-6"
          >
            A beautiful, focused workspace designed to help you organize chaos and create content faster.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full lg:w-[85%] mx-auto mt-20"
        >
          {/* Framer-style background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-gradient-to-r from-primary/30 via-purple-500/20 to-pink-500/30 blur-[120px] -z-10 rounded-full pointer-events-none" />

          {/* Main Dashboard Window */}
          <div className="relative z-10 w-full bg-card rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col">
            
            {/* Mac Window Header */}
            <div className="h-14 bg-secondary border-b border-border flex items-center px-5 gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
              <div className="w-3.5 h-3.5 rounded-full bg-orange-400" />
              <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
              <div className="mx-auto px-4 py-1.5 rounded-md bg-card border border-border text-[13px] text-muted-foreground font-medium w-64 text-center truncate">
                app.clipcycle.com/dashboard
              </div>
            </div>

            {/* Application UI */}
            <div className="flex h-[600px]">
              
              {/* Sidebar */}
              <div className="w-[280px] border-r border-border bg-secondary/50 p-6 flex flex-col gap-6 hidden md:flex">
                <span className="font-bold text-2xl tracking-tight text-foreground px-2">ClipCycle</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card text-primary font-bold border border-border shadow-sm">
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-card hover:text-foreground hover:shadow-sm hover:border hover:border-border border border-transparent transition-all cursor-pointer font-medium">
                    <Layers className="w-5 h-5" />
                    All Ideas
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-card hover:text-foreground hover:shadow-sm hover:border hover:border-border border border-transparent transition-all cursor-pointer font-medium">
                    <Wand2 className="w-5 h-5" />
                    Generate
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-card hover:text-foreground hover:shadow-sm hover:border hover:border-border border border-transparent transition-all cursor-pointer font-medium">
                    <Calendar className="w-5 h-5" />
                    Calendar
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-card p-10 overflow-hidden flex flex-col gap-10">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-foreground tracking-tight">Good morning, Creator 👋</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary cursor-pointer transition-colors">
                      <Search className="w-6 h-6" />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[15px] font-bold shadow-sm hover:scale-105 transition-transform">
                      <Plus className="w-5 h-5" />
                      Capture Idea
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="p-8 rounded-2xl border border-border bg-secondary hover:shadow-md transition-shadow">
                    <span className="text-[15px] font-semibold text-muted-foreground uppercase tracking-wider">Ideas Saved</span>
                    <div className="text-4xl font-bold text-foreground mt-3">142</div>
                  </div>
                  <div className="p-8 rounded-2xl border border-border bg-secondary hover:shadow-md transition-shadow">
                    <span className="text-[15px] font-semibold text-muted-foreground uppercase tracking-wider">Generated Drafts</span>
                    <div className="text-4xl font-bold text-foreground mt-3">38</div>
                  </div>
                  <div className="p-8 rounded-2xl border border-primary/20 bg-primary/10 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                    <div className="flex items-center gap-2 mb-3 relative z-10">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="text-[15px] font-bold text-primary uppercase tracking-wider">AI Productivity</span>
                    </div>
                    <div className="text-4xl font-bold text-primary relative z-10">85/100</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[18px] font-bold text-foreground mb-6">Recent captures ready to process</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl border border-border hover:shadow-lg hover:border-primary/50 cursor-pointer transition-all bg-card flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <span className="text-[14px] font-bold text-pink-600 uppercase tracking-widest">Instagram</span>
                      </div>
                      <p className="font-bold text-[18px] text-foreground leading-snug">5 Productivity hacks for Notion users</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-border hover:shadow-lg hover:border-primary/50 cursor-pointer transition-all bg-card flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                          <Wand2 className="w-5 h-5" />
                        </div>
                        <span className="text-[14px] font-bold text-orange-600 uppercase tracking-widest">Twitter Thread</span>
                      </div>
                      <p className="font-bold text-[18px] text-foreground leading-snug">How I structure my week as a creator</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Floating UI Elements (Parallax effects) */}
          <motion.div 
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-16 top-24 z-20 hidden lg:block"
          >
            <div className="bg-card/90 backdrop-blur-xl p-5 rounded-2xl border border-border shadow-2xl flex items-center gap-4 w-72">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-foreground">Draft Generated!</span>
                <span className="text-[14px] text-muted-foreground">Your LinkedIn post is ready.</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-16 bottom-24 z-20 hidden lg:block"
          >
            <div className="bg-card/90 backdrop-blur-xl p-5 rounded-2xl border border-border shadow-2xl flex items-center gap-4 w-64">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-foreground">Auto-Tagged</span>
                <span className="text-[14px] text-muted-foreground">Added to #DesignSystems</span>
              </div>
            </div>
          </motion.div>
          
          {/* Floating AI Tag */}
          <motion.div 
            animate={{ y: [-10, 10, -10], x: [10, -10, 10] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -right-8 bottom-32 z-20 hidden lg:block"
          >
            <div className="bg-purple-100/90 backdrop-blur-xl px-5 py-3 rounded-full border border-purple-200 shadow-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <span className="text-[14px] font-bold text-purple-700">#Productivity Content</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
