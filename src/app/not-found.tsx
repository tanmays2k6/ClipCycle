"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center max-w-md"
      >
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-brand-primary blur-3xl opacity-20 rounded-full" />
          <Logo size={80} animated />
        </div>
        
        <h1 className="text-[120px] font-bold text-text-primary leading-none tracking-tighter mb-4 gradient-text">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-text-primary mb-3 tracking-tight">
          We couldn&apos;t find that page.
        </h2>
        
        <p className="text-text-secondary mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to capturing brilliant ideas.
        </p>

        <Link
          href="/dashboard"
          className="btn-primary"
        >
          Return to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
