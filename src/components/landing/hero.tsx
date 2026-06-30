"use client";

import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, Mic, Bookmark, StickyNote, Play, Star } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { BrandLogo } from "@/components/ui/brand-logo";
import { HeroProductShowcase } from "./hero-product-showcase";

export function Hero() {
  return (
    <section className="relative overflow-hidden section-padding bg-background pt-[160px] pb-[80px]">
      <div className="container-premium relative z-10">
        {/* 60/40 Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          
          {/* LEFT Column: 60% */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start w-full">
            {/* Brand Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center lg:justify-start mb-8 md:mb-10"
            >
              <BrandLogo className="w-[140px] sm:w-[170px] md:w-[200px] lg:w-[240px]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-bold text-primary bg-primary/10 rounded-full mb-8 shadow-sm">
                <Sparkles className="w-4 h-4" />
                AI Idea Vault
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[56px] md:text-[72px] font-bold tracking-tight text-foreground leading-[1.05] max-w-[800px]"
            >
              Never Lose Another <br className="hidden sm:block" />
              Content Idea
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-[18px] md:text-[22px] leading-[1.6] text-muted-foreground max-w-xl font-medium mx-auto lg:mx-0"
            >
              Capture ideas from anywhere — notes, screenshots, voice memos, and saved posts. Let ClipCycle's AI organize everything so you can focus on creating.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/auth/signup" className="btn-primary w-full sm:w-auto px-8 h-14 text-[18px] rounded-2xl">
                Start Free
              </Link>
              <Link href="#product" className="btn-secondary w-full sm:w-auto px-8 h-14 text-[18px] rounded-2xl">
                <Play className="w-5 h-5 fill-current" /> Watch Demo
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-14 pt-8 border-t border-border/50 w-full max-w-xl"
            >
              <div className="flex -space-x-4">
                {[
                  "https://i.pravatar.cc/100?img=1",
                  "https://i.pravatar.cc/100?img=2",
                  "https://i.pravatar.cc/100?img=3",
                  "https://i.pravatar.cc/100?img=4",
                  "https://i.pravatar.cc/100?img=5",
                ].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Creator avatar ${i + 1}`}
                    className="w-14 h-14 rounded-full border-4 border-white object-cover shadow-sm"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-foreground text-[16px]">Loved by 2,400+ creators</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT Column: 50% (Interactive Product Showcase) */}
          <div className="relative flex w-full items-center justify-center mt-12 lg:mt-0 lg:ml-auto">
            <HeroProductShowcase />
          </div>

        </div>
      </div>
    </section>
  );
}
