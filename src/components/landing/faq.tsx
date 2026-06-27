"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What types of content ideas can I capture?",
    answer:
      "Anything. Text notes, URLs, screenshots, voice memos, forwarded messages, Instagram saves, tweet links — you name it. ClipCycle normalizes every format into a single, searchable idea card.",
  },
  {
    question: "How does the AI organization work?",
    answer:
      "When you add an idea, ClipCycle's AI (powered by Google Gemini) analyzes the content to understand its topic, potential format (Reel, Carousel, Blog, Thread, etc.), target audience, and trending relevance. It then auto-tags the idea and places it in the most relevant smart collection.",
  },
  {
    question: "Can I generate content for multiple platforms?",
    answer:
      "Yes. Select any idea and choose your target platform — Instagram caption, YouTube script, LinkedIn post, Twitter thread, or blog outline. ClipCycle generates platform-specific drafts with appropriate formatting, hashtags, and tone.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. All data is stored securely. Your ideas are encrypted at rest, transmitted over TLS, and never used to train AI models. You own your data fully and can export or delete it at any time.",
  },
  {
    question: "Do I need a credit card to start?",
    answer:
      "No. The Free plan is completely free forever — no credit card required. You get 50 ideas per month, basic AI organization, and 3 smart collections. Upgrade to Pro whenever you're ready.",
  },
  {
    question: "What makes ClipCycle different from Notion or Google Keep?",
    answer:
      "Notion and Google Keep are general-purpose note apps — you still have to manually organize and make sense of your ideas. ClipCycle is purpose-built for content creators. It understands your ideas contextually, organizes them automatically, and generates publish-ready content from them. Zero manual sorting required.",
  },
];

function FaqItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 p-6 text-left rounded-3xl glass border border-border hover:border-border-hover transition-all duration-300 group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-text-primary leading-relaxed">
          {item.question}
        </span>
        <span className="shrink-0 w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center mt-0.5 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-colors">
          {isOpen ? (
            <Minus className="w-4 h-4 text-violet-400" />
          ) : (
            <Plus className="w-4 h-4 text-text-tertiary group-hover:text-violet-400 transition-colors" />
          )}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <p className="text-sm text-text-secondary leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding relative">
      {/* Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container-premium max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">
            FAQ
          </span>
          <h2 className="mt-4 text-section max-w-2xl mx-auto">
            Questions? <span className="gradient-text">Answered.</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Everything you need to know about ClipCycle.
          </p>
        </motion.div>

        <div className="mt-16 space-y-4">
          {faqs.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
