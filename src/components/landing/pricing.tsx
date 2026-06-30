"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
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
    cta: "Start Free",
    href: "/auth/signup",
    highlighted: false,
    badge: null
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
    badge: "Most Popular"
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="section-padding relative bg-background border-b border-border/50">
      <div className="container-premium">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-wider font-semibold text-primary mb-6"
          >
            Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-h2"
          >
            Simple, transparent pricing.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-body mt-6"
          >
            Start free. Upgrade when you're ready. No hidden fees. Cancel anytime.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-8 md:gap-12 max-w-6xl mx-auto mt-[100px]">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative bg-card rounded-[32px] p-8 transition-all duration-300 flex flex-col w-full min-h-[600px]",
                plan.highlighted
                  ? "border-2 border-primary shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)] scale-100 lg:scale-[1.05] z-10"
                  : "border border-border shadow-sm hover:shadow-md hover:-translate-y-1"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-h3 text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground h-10">
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-foreground tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-foreground font-medium"
                  >
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={cn(
                  "w-full",
                  plan.highlighted ? "btn-primary" : "btn-secondary"
                )}
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
