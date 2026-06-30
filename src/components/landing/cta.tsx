"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="section-padding relative bg-gradient-to-b from-background to-brand-primary/5">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-10 min-h-[320px] w-full flex flex-col justify-center items-center text-center shadow-2xl"
        >
          {/* Background decorations & Floating Icons */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-card opacity-10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-card opacity-10 rounded-full blur-3xl" />
            
            {/* Floating Icons */}
            <motion.div 
              animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[15%] left-[10%] opacity-20 text-white"
            >
              <Sparkles className="w-16 h-16" />
            </motion.div>
            <motion.div 
              animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[20%] right-[10%] opacity-20 text-white"
            >
              <ArrowRight className="w-20 h-20" />
            </motion.div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-[48px] font-bold tracking-tight text-white mb-8 max-w-3xl leading-[1.1]">
              Ready to build your ultimate Idea Vault?
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/auth/signup" className="btn-primary bg-card text-primary hover:bg-muted w-full sm:w-auto px-8 h-14 text-lg rounded-2xl">
                Start Free
              </Link>
            </div>
            <p className="text-primary-foreground/60 text-sm mt-6">
              No credit card required. Free forever plan available.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
