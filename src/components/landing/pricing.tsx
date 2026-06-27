"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

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
    cta: "Start Free",
    href: "/auth/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹199",
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
    cta: "Get Pro Access",
    href: "/auth/signup",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section-padding relative">
      {/* Divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-text-tertiary">
            Pricing
          </span>
          <h2 className="mt-4 text-section max-w-2xl mx-auto">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto">
            Start free. Upgrade when you&apos;re ready. No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative group p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-1 ${
                plan.highlighted
                  ? "bg-surface border-violet-500/30 shadow-2xl shadow-violet-500/10"
                  : "glass border-border hover:border-border-hover shadow-lg"
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-glow">
                    <Sparkles className="w-3.5 h-3.5" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-text-primary">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-text-primary tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm font-medium text-text-tertiary">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-text-secondary"
                  >
                    <Check className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-4 px-4 text-sm font-medium rounded-2xl transition-all duration-300 flex justify-center ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-violet-600/20"
                    : "bg-surface-hover border border-border text-text-primary hover:border-border-hover hover:bg-surface"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
