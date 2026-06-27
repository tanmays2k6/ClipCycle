"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Mic,
  Camera,
  Wand2,
  Search,
  FolderKanban,
  Calendar,
  BarChart3
} from "lucide-react";
import { cn } from "@/utils/cn";

const features = [
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Deep contextual understanding of your raw ideas, identifying the topic, target audience, and best platform.",
    colSpan: "md:col-span-2 lg:col-span-2",
    gradient: "from-violet-500/20 to-indigo-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: Mic,
    title: "Voice Capture",
    description: "Record audio notes on the go. AI transcribes and formats them instantly.",
    colSpan: "md:col-span-1 lg:col-span-1",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Camera,
    title: "Screenshot OCR",
    description: "Extract text from images automatically.",
    colSpan: "md:col-span-1 lg:col-span-1",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Search by meaning, not exact keywords.",
    colSpan: "md:col-span-1 lg:col-span-1",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Wand2,
    title: "Instant Repurpose",
    description: "Turn one idea into an Instagram Carousel, Twitter Thread, and LinkedIn Post simultaneously with one click.",
    colSpan: "md:col-span-2 lg:col-span-2",
    gradient: "from-fuchsia-500/20 to-purple-500/20",
    iconColor: "text-fuchsia-400",
  },
  {
    icon: FolderKanban,
    title: "Collections",
    description: "Auto-grouping of similar topics.",
    colSpan: "md:col-span-1 lg:col-span-1",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Calendar,
    title: "Content Calendar",
    description: "Schedule your generated drafts directly to your platforms. Visual planning for the entire month.",
    colSpan: "md:col-span-2 lg:col-span-2",
    gradient: "from-indigo-500/20 to-blue-500/20",
    iconColor: "text-indigo-400",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track which ideas performed best and let the AI suggest what to create next based on real data.",
    colSpan: "md:col-span-2 lg:col-span-2",
    gradient: "from-rose-500/20 to-red-500/20",
    iconColor: "text-rose-400",
  },
];

export function Features() {
  return (
    <section id="features" className="section-padding relative">
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
            Features
          </span>
          <h2 className="mt-4 text-section max-w-2xl mx-auto">
            Everything you need to <span className="text-text-secondary">create better content.</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)] max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "group relative overflow-hidden p-8 rounded-3xl glass border border-border/50 hover:border-border transition-all duration-500 hover:shadow-lg flex flex-col justify-between",
                feature.colSpan
              )}
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6", feature.gradient)}>
                  <feature.icon className={cn("w-6 h-6", feature.iconColor)} />
                </div>
                <div className="mt-auto">
                  <h3 className="text-xl font-semibold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
