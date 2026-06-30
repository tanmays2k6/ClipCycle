"use client";

import { motion } from "framer-motion";
import { Bookmark, Clock, LayoutGrid } from "lucide-react";
import { cn } from "@/utils/cn";

const problemCards = [
  {
    icon: Bookmark,
    title: "Ideas Lost",
    desc: "73% of brilliant ideas are forgotten because they were saved in the wrong app. Stop digging through Apple Notes.",
    bg: "bg-red-50",
    iconColor: "text-red-500",
    borderColor: "border-t-red-500",
  },
  {
    icon: Clock,
    title: "Time Wasted",
    desc: "Creators waste 4+ hours every week just searching for old bookmarks, voice memos, and screenshots.",
    bg: "bg-orange-50",
    iconColor: "text-orange-500",
    borderColor: "border-t-orange-500",
  },
  {
    icon: LayoutGrid,
    title: "Apps Everywhere",
    desc: "Using 6 different apps creates friction. Friction stops you from publishing. Centralize your brain.",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
    borderColor: "border-t-blue-500",
  }
];

export function Problem() {
  return (
    <section id="problem" className="relative w-full section-padding bg-background border-b border-border overflow-hidden">
      {/* Subtle Dot Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
      
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container-premium relative z-10 flex flex-col items-center text-center">
        
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm uppercase tracking-wider font-semibold text-primary mb-6"
        >
          The Problem
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-h2 max-w-[900px] mb-20"
        >
          Your ideas are scattered across <br className="hidden md:block"/> 6 different apps.
        </motion.h2>

        {/* Cards - spanning full width of container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {problemCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "bg-card border border-border border-t-[6px] shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl p-10 flex flex-col items-start text-left hover:-translate-y-2",
                card.borderColor
              )}
            >
              <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mb-8", card.bg)}>
                <card.icon className={cn("w-10 h-10", card.iconColor)} />
              </div>
              <h3 className="text-h3 mb-4 text-foreground">
                {card.title}
              </h3>
              <p className="text-[18px] text-muted-foreground leading-[1.6]">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
