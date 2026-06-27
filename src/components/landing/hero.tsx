"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Image as ImageIcon, Mic, Bookmark } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24 lg:h-screen lg:min-h-[800px] lg:max-h-[900px] flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-violet-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="container-premium relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy */}
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-accent-dim border border-violet-500/20 text-violet-400">
                <Sparkles className="w-3.5 h-3.5" />
                AI Content Vault
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-6 text-display"
            >
              ClipCycle <br />
              Never Lose Another <br className="hidden sm:block" />
              <span className="gradient-text">Content Idea</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-6 text-body-large text-text-secondary max-w-lg"
            >
              Capture ideas from anywhere — notes, screenshots, voice memos, and saved posts. Let ClipCycle&apos;s AI organize everything so you can focus on creating.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4"
            >
              <Link href="/auth/signup" className="btn-primary w-full sm:w-auto text-base px-8 py-3.5">
                Start Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link href="#product" className="btn-secondary w-full sm:w-auto text-base px-8 py-3.5 text-center flex items-center justify-center">
                Watch Demo
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-12 flex items-center gap-4 text-sm text-text-tertiary"
            >
              <div className="flex -space-x-3">
                {[
                  "https://i.pravatar.cc/100?img=1",
                  "https://i.pravatar.cc/100?img=2",
                  "https://i.pravatar.cc/100?img=3",
                  "https://i.pravatar.cc/100?img=4",
                  "https://i.pravatar.cc/100?img=5",
                ].map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img}
                    alt={`User avatar ${i + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-text-primary">Trusted by 2,400+</span>
                <span>student creators</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Illustration */}
          <div className="relative hidden lg:block h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center">
              
              {/* Central Vault */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-20 w-64 h-64 glass rounded-3xl border border-border shadow-premium flex flex-col items-center justify-center gap-4"
              >
                <div className="relative flex items-center justify-center mb-2">
                  <div className="absolute inset-0 bg-brand-primary/40 blur-2xl rounded-full" />
                  <Logo size={64} animated />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-text-primary">ClipCycle Vault</h3>
                  <p className="text-xs text-text-secondary mt-1">AI processing active</p>
                </div>
              </motion.div>

              {/* Orbiting Cards */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[10%] z-30"
              >
                <div className="glass px-4 py-3 rounded-2xl border border-border flex items-center gap-3 shadow-lg">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Instagram</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[15%] left-[5%] z-30"
              >
                <div className="glass px-4 py-3 rounded-2xl border border-border flex items-center gap-3 shadow-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Mic className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Voice Notes</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-[20%] right-[5%] z-30"
              >
                <div className="glass px-4 py-3 rounded-2xl border border-border flex items-center gap-3 shadow-lg">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Bookmarks</span>
                </div>
              </motion.div>

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full -z-10" style={{ pointerEvents: 'none' }}>
                <motion.path
                  d="M150 150 Q 250 200 300 300"
                  stroke="rgba(139, 92, 246, 0.2)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
                <motion.path
                  d="M100 450 Q 200 400 300 300"
                  stroke="rgba(139, 92, 246, 0.2)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                />
                <motion.path
                  d="M450 180 Q 380 220 300 300"
                  stroke="rgba(139, 92, 246, 0.2)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.9 }}
                />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
