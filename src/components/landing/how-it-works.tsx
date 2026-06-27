"use client";

import { motion } from "framer-motion";
import { Download, Sparkles, Layers, PenTool } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Capture Anything",
    description:
      "Paste a link, type a thought, upload a screenshot, or record a voice note. ClipCycle accepts every format you throw at it instantly.",
    detail: "Supports text, URLs, images, and audio.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI Organizes",
    description:
      "Our AI automatically tags, summarizes, and extracts the core concept from your raw idea, identifying the best platform for it.",
    detail: "Powered by deep contextual models.",
  },
  {
    number: "03",
    icon: Layers,
    title: "Review Your Vault",
    description:
      "Ideas flow into smart collections. Browse your personalized Pinterest-style vault where similar ideas are clustered together.",
    detail: "Zero manual tagging required.",
  },
  {
    number: "04",
    icon: PenTool,
    title: "Generate & Publish",
    description:
      "Select any idea and click generate. Instantly get a ready-to-post draft for Instagram, LinkedIn, or Twitter.",
    detail: "One-click platform-specific formatting.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="container-premium max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">
            The Process
          </span>
          <h2 className="mt-4 text-section">
            From chaotic thought to{" "}
            <span className="gradient-text">published post.</span>
          </h2>
        </motion.div>

        <div className="mt-24 relative">
          {/* Glowing Vertical Line */}
          <div className="absolute left-[39px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-border">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent via-indigo-500 to-transparent"
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          <div className="space-y-16">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className={`relative flex flex-col md:flex-row items-start gap-8 md:gap-16 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Center Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass border border-border shadow-glow items-center justify-center z-10 bg-background">
                  <span className="text-sm font-bold text-accent">{step.number}</span>
                </div>

                {/* Mobile Node */}
                <div className="md:hidden absolute left-[21px] w-10 h-10 rounded-full glass border border-border shadow-glow flex items-center justify-center z-10 bg-background">
                  <span className="text-xs font-bold text-accent">{step.number}</span>
                </div>

                {/* Content Card */}
                <div className={`flex-1 pl-20 md:pl-0 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                  <div className={`inline-block p-8 rounded-3xl glass border border-transparent hover:border-border transition-colors w-full ${i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}>
                    <div className={`flex items-center gap-4 mb-5 ${i % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                      <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-primary">
                        <step.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                    <p className={`mt-4 text-sm font-medium text-text-tertiary flex items-center gap-2 ${i % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      {step.detail}
                    </p>
                  </div>
                </div>

                {/* Empty Spacer */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
