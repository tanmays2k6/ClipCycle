"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect to get started and test the waters.",
    features: [
      "50 ideas per month",
      "Basic AI organization",
      "3 smart collections",
      "Text & link capture",
      "7-day idea history",
    ],
    cta: "Current Plan",
    highlighted: false,
    current: true,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "For serious creators who ship content weekly.",
    features: [
      "Unlimited ideas",
      "Advanced AI organization",
      "Unlimited collections",
      "All capture formats",
      "AI content generation",
      "Semantic search",
      "Priority support",
      "Export to Notion & Google Docs",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    current: false,
  },
  {
    name: "Team",
    price: "₹999",
    period: "/month",
    description: "For creator teams and content agencies.",
    features: [
      "Everything in Pro",
      "5 team members",
      "Shared collections",
      "Team idea board",
      "Content calendar",
      "Analytics dashboard",
      "Custom AI prompts",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
    current: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
          Upgrade Your Plan
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Unlock unlimited ideas, AI generation, and more.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={cn(
              "relative group p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-1",
              plan.highlighted
                ? "bg-surface border-violet-500/30 shadow-xl shadow-violet-500/10"
                : "bg-surface/50 border-border hover:border-border-hover"
            )}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                  <Sparkles className="w-3 h-3" />
                  Recommended
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
              <p className="mt-1 text-sm text-text-tertiary">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                <span className="text-sm text-text-tertiary">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <Check className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={cn(
                "w-full py-3 px-4 text-sm font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
                plan.current
                  ? "bg-surface-hover border border-border text-text-tertiary cursor-default"
                  : plan.highlighted
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/20"
                    : "bg-surface-hover border border-border text-text-primary hover:border-border-hover"
              )}
            >
              {plan.cta}
              {!plan.current && <ArrowRight className="w-4 h-4" />}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
