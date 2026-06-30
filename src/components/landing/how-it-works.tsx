"use client";

import { motion } from "framer-motion";
import { Plus, Brain, Tag, Wand2, Send, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";

const workflowSteps = [
  {
    icon: Plus,
    title: "Capture",
    desc: "Save ideas instantly",
    color: "text-blue-500",
    bg: "bg-blue-50",
    borderColor: "border-blue-100"
  },
  {
    icon: Brain,
    title: "AI Organize",
    desc: "Auto-categorized",
    color: "text-purple-500",
    bg: "bg-purple-50",
    borderColor: "border-purple-100"
  },
  {
    icon: Tag,
    title: "Smart Tags",
    desc: "Indexed for search",
    color: "text-pink-500",
    bg: "bg-pink-50",
    borderColor: "border-pink-100"
  },
  {
    icon: Wand2,
    title: "Generate Content",
    desc: "Drafts created",
    color: "text-orange-500",
    bg: "bg-orange-50",
    borderColor: "border-orange-100"
  },
  {
    icon: Send,
    title: "Publish",
    desc: "Share with the world",
    color: "text-green-500",
    bg: "bg-green-50",
    borderColor: "border-green-100"
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full section-padding bg-background border-b border-border overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container-premium relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-wider font-semibold text-primary mb-6"
          >
            How It Works
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-h2"
          >
            From chaotic thought to published post.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-body max-w-2xl mx-auto mt-6"
          >
            See how ClipCycle transforms your scattered inspiration into a streamlined content factory.
          </motion.p>
        </div>

        {/* Horizontal Workflow */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4 lg:gap-0 w-full">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col lg:flex-row items-center flex-1 w-full"
            >
              {/* Card */}
              <div className={cn(
                "flex flex-col items-center text-center p-8 bg-card rounded-3xl shadow-sm border w-full h-full min-h-[260px] hover-lift border-t-[6px]",
                step.borderColor
              )}>
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", step.bg)}>
                  <step.icon className={cn("w-8 h-8", step.color)} />
                </div>
                <h3 className="text-[20px] font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>

              {/* Arrow */}
              {index < workflowSteps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-primary/40 px-4">
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-8 h-8" />
                  </motion.div>
                </div>
              )}
              {/* Mobile Arrow */}
              {index < workflowSteps.length - 1 && (
                <div className="flex lg:hidden items-center justify-center text-primary/40 py-4">
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-8 h-8 rotate-90" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
