"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  Social: [
    { label: "Github", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Twitter", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background overflow-hidden">
      {/* CTA Banner */}
      <section className="py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container-premium text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
              Stop losing your <span className="gradient-text">best ideas.</span>
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-lg mx-auto">
              Join 2,400+ creators who capture, organize, and create content faster.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 text-sm font-medium rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 shadow-xl shadow-violet-600/20 hover:-translate-y-0.5"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer Content */}
      <div className="container-premium pb-12 pt-8 border-t border-border/40">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-[16px]">
              <Logo size={36} />
              <span className="text-lg font-semibold tracking-tight text-text-primary">
                ClipCycle
              </span>
            </Link>
            <p className="mt-4 text-sm text-text-tertiary leading-relaxed max-w-xs">
              Never Lose Another Content Idea.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h4 className="text-sm font-medium text-text-primary mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} ClipCycle. All rights reserved.
          </p>
          <p className="text-xs text-text-tertiary flex items-center gap-1">
            Built with <span className="text-rose-500">♥</span> for creators.
          </p>
        </div>
      </div>
    </footer>
  );
}
