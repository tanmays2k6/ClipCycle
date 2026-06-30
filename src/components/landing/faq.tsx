"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/utils/cn";

const faqs = [
  {
    question: "What types of content ideas can I capture?",
    answer:
      "Anything. Text notes, URLs, screenshots, voice memos, forwarded messages, Instagram saves, tweet links — you name it. ClipCycle normalizes every format into a single, searchable idea card.",
  },
  {
    question: "How does the AI organization work?",
    answer:
      "When you add an idea, ClipCycle's AI analyzes the content to understand its topic, potential format (Reel, Carousel, Blog, Thread, etc.), target audience, and trending relevance. It then auto-tags the idea and places it in the most relevant smart collection.",
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
      className={cn(
        "bg-card rounded-2xl border transition-all duration-300 overflow-hidden",
        isOpen ? "border-primary/20 shadow-md ring-1 ring-primary/10" : "border-border shadow-sm hover:border-primary/30"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 p-6 text-left group bg-card"
        aria-expanded={isOpen}
      >
        <span className={cn(
          "text-[16px] font-semibold transition-colors duration-300",
          isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
        )}>
          {item.question}
        </span>
        <span className={cn(
          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300",
          isOpen ? "bg-primary text-white" : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        )}>
          {isOpen ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
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
          >
            <div className="px-6 pb-6 pt-0">
              <p className="text-body text-muted-foreground leading-relaxed">
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding relative bg-background border-b border-border/50">
      <div className="container-premium max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-wider font-semibold text-primary mb-6"
          >
            FAQ
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-h2"
          >
            Questions? Answered.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-body mt-6"
          >
            Everything you need to know about ClipCycle.
          </motion.p>
        </div>

        <div className="space-y-4">
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
